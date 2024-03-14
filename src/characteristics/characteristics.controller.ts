import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CharacteristicDto, CharacteristicsQueryParamsDto } from './dto';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { AccessTokenJwt } from 'src/auth/guards/AccessTokenJwt.guard';
import { CharacteristicsService } from './characteristics.service';

@Controller('characteristics')
export class CharacteristicsController {
  private logger = new Logger(CharacteristicsController.name);
  constructor(
    private readonly characteristicsService: CharacteristicsService,
  ) {}

  @Get('types')
  async getTypes(@Query() queryParams: CharacteristicsQueryParamsDto) {
    this.logger.log(queryParams);

    return await this.characteristicsService.getTypes(queryParams);
  }
  @Get('holidays')
  async getHolidays(@Query() queryParams: CharacteristicsQueryParamsDto) {
    return await this.characteristicsService.getHolidays(queryParams);
  }
  @Get('nationalCuisines')
  async getNationalCuisines(
    @Query() queryParams: CharacteristicsQueryParamsDto,
  ) {
    return await this.characteristicsService.getNationalCuisines(queryParams);
  }
}
