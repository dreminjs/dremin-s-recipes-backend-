import {
  Body,
  Controller,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CharacteristicDto } from 'src/characteristics/dto';

import { AdminService } from './admin.service';
import { AccessTokenJwt } from 'src/auth/guards/AccessTokenJwt.guard';
import { AdminGuard } from './guards/admin.guard';

@UseGuards(AdminGuard)
@UseGuards(AccessTokenJwt)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private logger = new Logger(AdminController.name);

  @Post('/types')
  async createType(@Body() body: CharacteristicDto) {
    this.logger.log('HIT', body);
    const type = await this.adminService.createType(body);
    return type;
  }

  @Post('/holidays')
  async createHoliday(@Body() body: CharacteristicDto) {
    const holiday = await this.adminService.createHoliday(body);
    return holiday;
  }

  @Post('/nationalCuisines')
  async createNationalCuisine(@Body() body: CharacteristicDto) {
    const nationalCuisine = await this.adminService.createNationalCuisine(body);
    return nationalCuisine;
  }

  @Put('/types/:id')
  async editType(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CharacteristicDto,
  ) {
    return await this.adminService.editType(body.name, id);
  }

  @Put('/holidays/:id')
  async editHoliday(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CharacteristicDto,
  ) {
    return await this.adminService.editHoliday(body.name, id);
  }

  @Put('/nationalCuisines/:id')
  async editNationalCuisine(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CharacteristicDto,
  ) {
    return await this.adminService.editNationalCuisine(body.name, id);
  }

  @Patch('checkRecipe/:id')
  async checkRecipe(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.checkRecipe(id);
    return { message: 'success' };
  }

  @Patch('rejectRecipe/:id')
  async rejectRecipe(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.rejectRecipe(id);
    return { message: 'success' };
  }
}
