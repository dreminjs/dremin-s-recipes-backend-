import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipeDto, QueryParamsGetRecipes } from './dto';
import { AccessTokenJwt } from 'src/auth/guards/AccessTokenJwt.guard';
import { RecipesService } from './recipes.service';
import * as path from 'path';

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
    @Req() req,
  ) {
    const { userId } = req.user;

    this.logger.log(JSON.parse(body.steps));

    const recipe = await this.recipeService.createRecipe(
      {
        title: body.description,
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

  @Get('/')
  async getRecipes(@Query() queryParams: QueryParamsGetRecipes) {
    const recipesData = await this.recipeService.getRecipes(queryParams);

    return recipesData;
  }

  @Get('ownRecipes')
  @UseGuards(AccessTokenJwt)
  async getOwnRecipes(
    @Query() queryParams: QueryParamsGetRecipes,
    @Req() { user },
  ) {
    const recipesData = await this.recipeService.getUserRecipes(
      queryParams,
      user.id,
    );

    return recipesData;
  }
}
