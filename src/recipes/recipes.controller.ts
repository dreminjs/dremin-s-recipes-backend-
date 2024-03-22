import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateRecipeDto,
  QueryParamsGetOwnRecipes,
  QueryParamsGetRecipes,
} from './dto';
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

  @Get('liked/:id')
  async getLikedRecipes(@Query() query, @Param('id', ParseIntPipe) id) {
    const recipes = await this.recipeService.getLikedRecipesByUserId(
      id,
      query.page,
      query.search,
    );
  }

  @UseGuards(AccessTokenJwt)
  @Get('ownRecipes')
  async getOwnRecipes(
    @Query() queryParams: QueryParamsGetOwnRecipes,
    @Req() { user },
  ) {
    const recipesData = await this.recipeService.getUserRecipes(
      queryParams,
      user.id,
    );

    return recipesData;
  }

  @Get('/:id')
  async getRecipe(@Param('id', ParseIntPipe) id: number) {
    const recipe = await this.recipeService.findRecipeById(id);

    return recipe;
  }

  @Get('additionalInformation')
  async getAdditionalInformation(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {}
}
