import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateRecipeDto,
  QueryParamsGetRecipes,
  QueryParamsGetOwnRecipes,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isArray } from 'class-validator';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RecipesService {
  private logger = new Logger(RecipesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createRecipe(
    { ingredients, steps, ...body }: any,
    filename: string,
    userId: number,
  ) {
    let ingredientsInfo = null;

    let stepsInfo = null;

    const recipe = await this.prismaService.recipe.create({
      data: {
        title: body.title,
        description: body.description,
        typeId: Number(body.typeId),
        nationalCuisineId: Number(body.nationalCuisineId),
        holidayId: Number(body.holidayId),
        img: filename,
        authorId: userId,
      },
    });

    if (ingredients instanceof Array) {
      ingredientsInfo = ingredients.map((el) => ({
        name: el.name,
        recipeId: recipe.id,
      }));
    } else {
      ingredientsInfo = [];
      ingredientsInfo.push({
        name: JSON.parse(ingredients).name,
        recipeId: recipe.id,
      });
    }

    if (steps instanceof Array) {
      stepsInfo = steps.map((el) => ({
        name: el.name,
        recipeId: recipe.id,
      }));
    } else {
      stepsInfo = [];
      stepsInfo.push({
        name: JSON.parse(steps).name,
        recipeId: recipe.id,
      });
    }

    await this.prismaService.step.createMany({
      data: stepsInfo,
    });

    await this.prismaService.ingredient.createMany({
      data: ingredientsInfo,
    });

    return recipe;
  }

  async getRecipes(body: QueryParamsGetRecipes) {
    if (!body.page) {
      return this.prismaService.recipe.findMany();
    }

    let prismaOptions: any = {
      take: 5,
      skip: (Number(body.page) - 1) * 5,
    };

    let prismaOptionForCount: any = {
      // take: 5,
      // skip: (Number(body.page) - 1) * 5,
    };

    const whereOptions: any = {};

    if (body.typeId instanceof Array) {
      whereOptions.OR = body.typeId;
    }
    if (body.typeId) {
      whereOptions.typeId = Number(body.typeId);
    }

    if (body.nationalCuisineId instanceof Array) {
      whereOptions.OR = body.nationalCuisineId;
    }
    if (body.nationalCuisineId) {
      whereOptions.nationalCuisineId = Number(body.nationalCuisineId);
    }

    if (body.holidayId instanceof Array) {
      whereOptions.OR = body.holidayId;
    }
    if (body.holidayId) {
      whereOptions.holidayId = Number(body.holidayId);
    }

    if (body.search) {
      whereOptions.title = {
        contains: body.search,
      };
    }

    if (Object.keys(whereOptions).length >= 1) {
      prismaOptions.where = whereOptions;
      this.logger.log(whereOptions);
      prismaOptionForCount.where = whereOptions;
    }

    if (body.orderBy) {
      prismaOptions = {
        ...prismaOptions,
        orderBy: {
          RecipesLikes: {
            _count: body.orderBy,
          },
        },

        include: {
          RecipesLikes: true,
        },
      };
    }

    prismaOptions.include = {
      author: {
        select: {
          username: true,
        },
      },
    };

    const recipes = await this.prismaService.recipe.findMany(prismaOptions);

    const countPages =
      await this.prismaService.recipe.count(prismaOptionForCount);

    return { recipes, count: Math.ceil(countPages / 5) };
  }

  async getUserRecipes(body: QueryParamsGetOwnRecipes, userId: number) {
    let prismaOptions: any = {
      take: 5,
      skip: (Number(body.page) - 1) * 5,
    };

    let prismaOptionForCount: any = {};

    let whereOptions: any = {
      authorId: userId,
    };

    if (body.search) {
      whereOptions.title = {
        contains: body.search,
      };
    }

    if (!JSON.parse(body.isChecked) && !JSON.parse(body.isRejected)) {
      whereOptions = {
        ...whereOptions,
        OR: [{ isRejected: false }, { isChecked: false }],
      };
    }

    if (JSON.parse(body.isChecked) && !JSON.parse(body.isRejected)) {
      whereOptions = {
        ...whereOptions,
        isChecked: true,
      };
    }

    prismaOptions.where = whereOptions;

    prismaOptionForCount.where = whereOptions;

    if (body.orderBy) {
      prismaOptions = {
        ...prismaOptions,
        orderBy: {
          RecipesLikes: {
            _count: body.orderBy,
          },
        },

        include: {
          RecipesLikes: true,
        },
      };
    }

    prismaOptions.include = {
      author: {
        select: {
          username: true,
        },
      },
    };

    const recipes = await this.prismaService.recipe.findMany(prismaOptions);

    const countPages =
      await this.prismaService.recipe.count(prismaOptionForCount);

    return { recipes, count: Math.ceil(countPages / 5) };
  }

  async getLikedRecipesByUserId(userId: number, page: string, search: string) {
    const prismaOptions: any = {
      take: 5,
      skip: (Number(page) - 1) * 5,
    };

    const whereOptions: any = {};

    if (search) {
      whereOptions.title = {
        contains: search,
      };

      prismaOptions.where = whereOptions;
    }

    const recipeIds =
      await this.prismaService.recipeLike.findMany(prismaOptions);

    const recipes = await this.prismaService.recipe.findMany({
      where: { id: { in: recipeIds.map((el) => el.id) } },
    });

    const countPages = await this.prismaService.recipe.count({
      where: { id: { in: recipeIds.map((el) => el.id) } },
    });

    return { recipes, count: Math.ceil(countPages / 5) };
  }

  async findRecipeById(id: number) {
    const recipe = await this.prismaService.recipe.findUnique({
      where: {
        id,
      },
      select: {
        type: true,
        nationalCuisine: true,
        holiday: true,
        steps: true,
        title: true,
        img: true,
        description: true,
        author: true,
        ingredients: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Такого рецепта нет!');
    }

    return recipe;
  }
}
