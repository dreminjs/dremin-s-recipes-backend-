import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateRecipeDto,
  QueryParamsGetLikedRecipes,
  QueryParamsGetOwnRecipes,
  QueryParamsGetRecipes,
  QueryParamsGetUsersRecipes,
} from './dto';
import { AccessTokenJwt } from 'src/auth/guards/AccessTokenJwt.guard';
import { RecipesService } from './recipes.service';
import * as path from 'path';
import { User } from 'src/user/decorators/user.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipeService: RecipesService) {}

  private logger = new Logger(RecipesController.name);

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AccessTokenJwt)
  async createRecipe(
    @Body() body: CreateRecipeDto,
    @UploadedFile() file,
    @User() { userId },
    @Req() req,
  ) {
    const recipe = await this.recipeService.createRecipe(
      {
        title: body.title,
        description: body.description,
        typeId: body.typeId,
        nationalCuisineId: body.nationalCuisineId,
        holidayId: body.holidayId,
        steps: JSON.parse(body.steps),
        ingredients: JSON.parse(body.ingredients),
      },
      req.filename,
      userId,
    );

    return recipe;
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AccessTokenJwt)
  async editRecipe(
    @Body() body: CreateRecipeDto,
    @UploadedFile() file,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const recipe = await this.recipeService.editRecipe(
      {
        title: body.title,
        description: body.description,
        typeId: body.typeId,
        nationalCuisineId: body.nationalCuisineId,
        holidayId: body.holidayId,
        steps: JSON.parse(body.steps),
        ingredients: JSON.parse(body.ingredients),
      },
      req?.filename,
      id,
    );

    return recipe;
  }

  @Get('/')
  async getRecipes(@Query() queryParams: QueryParamsGetRecipes) {
    const recipesData = await this.recipeService.getRecipes(queryParams);

    return recipesData;
  }

  @Get('/liked/user/:id')
  async getUsersLikedRecipes(
    @Query() queryParams: QueryParamsGetUsersRecipes,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const recipes = await this.recipeService.getLikedRecipesByUserId(
      id,
      queryParams.page,
      queryParams.search,
    );

    return recipes;
  }

  @Get('/user/:id')
  async getUsersRecipes(
    @Query() queryParams: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.log('HIT');
    const recipes = await this.recipeService.getUserRecipes(
      { page: queryParams.page, search: queryParams.search },
      id,
    );

    return recipes;
  }

  @UseGuards(AccessTokenJwt)
  @Get('liked')
  async getLikedRecipes(
    @Query() query: QueryParamsGetLikedRecipes,
    @User() { userId },
  ) {
    const recipes = await this.recipeService.getLikedRecipesByUserId(
      userId,
      query.page,
      query.search,
    );

    return recipes;
  }

  @UseGuards(AccessTokenJwt)
  @Delete('dislike/:id')
  async dislikeRecipe(
    @Param('id', ParseIntPipe) id: number,
    @User() { userId },
  ) {
    const recipe = await this.recipeService.dislikeRecipe(id, userId);

    return { isLiked: false,countLikes:0 };
  }

  @UseGuards(AccessTokenJwt)
  @Post('like/:id')
  async likeRecipe(@Param('id', ParseIntPipe) id: number, @User() { userId }) {
    const recipe = await this.recipeService.likeRecipe(id, userId);

    return { isLiked: true };
  }
  @UseGuards(AccessTokenJwt)
  @Get('checkLike/:id')
  async checkLike(@Param('id', ParseIntPipe) id: number, @User() { userId }) {
    const isLiked = await this.recipeService.checkLike(id, userId);

    return isLiked;
  }

  @UseGuards(AccessTokenJwt)
  @Get('ownRecipes')
  async getOwnRecipes(
    @Query() queryParams: QueryParamsGetOwnRecipes,
    @User() { userId },
  ) {
    const recipesData = await this.recipeService.getUserRecipes(
      queryParams,
      userId,
    );

    return recipesData;
  }

  @Get('/:id')
  async getRecipe(@Param('id', ParseIntPipe) id: number) {
    const recipe = await this.recipeService.findRecipeById(id);

    return recipe;
  }

  @Delete('/:id')
  async deleteRecipe(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.deleteRecipe(id);
  }
}
