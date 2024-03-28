import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateRecipeDto,
  QueryParamsGetRecipes,
  QueryParamsGetOwnRecipes,
  GetUserRecipesDto,
  GetRecipesDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isArray } from 'class-validator';
import { NotFoundError } from 'rxjs';
import { join } from 'path';
import { unlink, unlinkSync } from 'fs';

@Injectable()
export class RecipesService {
  private logger = new Logger(RecipesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createRecipe(
    { ingredients, steps, ...body }: CreateRecipeDto,
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
        img: filename || '',
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
        name: JSON.parse(ingredients)!.name,
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

  async editRecipe(
    { ingredients, steps, ...body }: any,
    filename: string,
    recipeId: number,
  ) {
    await this.prismaService.step.deleteMany({ where: { recipeId } });
    await this.prismaService.ingredient.deleteMany({ where: { recipeId } });

    let ingredientsInfo = null;

    let stepsInfo = null;

    const { img } = await this.prismaService.recipe.findFirst({
      where: { id: recipeId },
    });

    unlinkSync(join('./static', img));

    const recipe = await this.prismaService.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: body.title,
        description: body.description,
        typeId: Number(body.typeId),
        nationalCuisineId: Number(body.nationalCuisineId),
        holidayId: Number(body.holidayId),
        img: filename,
        isChecked: false,
        isRejected: false,
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

  async getRecipes(body: any) {
    if (!body.page) {
      return this.prismaService.recipe.findMany();
    }

    let prismaOptions: any = {
      take: 5,
      skip: (Number(body.page) - 1) * 5,
    };

    let prismaOptionForCount: any = {};

    let whereOptions: any = {};

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

    if (body.isChecked !== undefined && JSON.parse(body.isChecked)) {
      whereOptions = {
        ...whereOptions,
        isChecked: true,
      };
    }
    if (body.isRejected !== undefined && JSON.parse(body.isRejected)) {
      whereOptions = {
        ...whereOptions,
        isRejected: true,
      };
    }

    if (
      body.isChecked !== undefined &&
      body.isRejected !== undefined &&
      !JSON.parse(body.isChecked) &&
      !JSON.parse(body.isRejected)
    ) {
      whereOptions = {
        ...whereOptions,
        isRejected: false,
        isChecked: false,
      };
    }

    if (body.orderBy && body.orderBy !== 'none') {
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

    if (Object.keys(whereOptions).length >= 1) {
      prismaOptions.where = whereOptions;

      prismaOptionForCount.where = whereOptions;
    }

    const recipes = await this.prismaService.recipe.findMany(prismaOptions);

    const countPages =
      await this.prismaService.recipe.count(prismaOptionForCount);

    return { recipes, count: Math.ceil(countPages / 5) };
  }

  async getUserRecipes(body: any, userId: number) {
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

    if (
      body.isChecked !== undefined &&
      body.isRejected !== undefined &&
      !JSON.parse(body.isChecked) &&
      !JSON.parse(body.isRejected)
    ) {
      whereOptions = {
        ...whereOptions,
        OR: [{ isRejected: true }, { isChecked: false }],
      };
    }

    if (body.isChecked !== undefined && JSON.parse(body.isChecked)) {
      whereOptions = {
        ...whereOptions,
        isChecked: true,
      };
    }

    prismaOptions.where = whereOptions;

    prismaOptionForCount.where = whereOptions;

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

    const whereOptions: any = {
      authorId: userId,
    };

    if (search) {
      whereOptions.title = {
        contains: search,
      };

      prismaOptions.where = whereOptions;
    }

    const recipeIds =
      await this.prismaService.recipeLike.findMany(prismaOptions);

    const recipes = await this.prismaService.recipe.findMany({
      where: { id: { in: recipeIds.map((el) => el.recipeId) } },
      select: {
        author: true,
        title: true,
        description: true,
        img: true,
        id: true,
      },
    });

    const countPages = await this.prismaService.recipe.count({
      where: { id: { in: recipeIds.map((el) => el.recipeId) } },
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
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        ingredients: true,
      },
    });

    const countOfLikes = await this.prismaService.recipeLike.count({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Такого рецепта нет!');
    }

    return { ...recipe, countOfLikes };
  }

  async likeRecipe(recipeId: number, userId: number) {
    const recipe = await this.prismaService.recipeLike.create({
      data: {
        recipeId,
        userId,
      },
    });

    return recipe;
  }
  async dislikeRecipe(recipeId, userId) {
    const recipe = await this.prismaService.recipeLike.deleteMany({
      where: {
        recipeId,
        userId,
      },
    });

    return recipe && { isLiked: false };
  }

  async checkLike(recipeId: number, userId: number) {
    const recipe = await this.prismaService.recipeLike.findFirst({
      where: {
        recipeId,
        userId,
      },
    });

    return recipe ? { isLiked: true } : { isLiked: false };
  }

  async deleteRecipe(recipeId: number) {
    await this.prismaService.recipeLike.deleteMany({
      where: {
        recipeId,
      },
    });

    await this.prismaService.ingredient.deleteMany({
      where: {
        recipeId,
      },
    });

    await this.prismaService.step.deleteMany({
      where: {
        recipeId,
      },
    });

    const recipe = await this.prismaService.recipe.delete({
      where: {
        id: recipeId,
      },
    });
    unlinkSync(join('./static', recipe.img));
  }

  async getUsersLikedRecipes(
    authorId: number,
    userId: number,
    page: number,
    search: string,
  ) {
    const whereOptions: any = {
      authorId,
    };

    if (search) {
      whereOptions.title = {
        contains: search,
      };
    }

    const recipes = await this.prismaService.recipeLike.findMany({
      take: 5,
      skip: (Number(page) - 1) * 5,
      where: {
        userId,
        recipe: whereOptions,
      },
      select: { recipe: true },
    });

    return recipes;
  }
}
