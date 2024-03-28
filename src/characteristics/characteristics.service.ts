import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CharacteristicsQueryParamsDto } from './dto';

@Injectable()
export class CharacteristicsService {
  private logger = new Logger(CharacteristicsService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getTypes(body: CharacteristicsQueryParamsDto) {
    this.logger.log(body);

    let prismaOptions: any = {
      take: 5,
      skip: (body.page - 1) * 5,
    };

    const whereOptions: any = {};

    if (body.search) {
      whereOptions.name = {
        contains: body.search,
      };
      prismaOptions = {
        ...prismaOptions,
        where: whereOptions,
      };
    }

    const types = await this.prismaService.type.findMany(prismaOptions);

    const count = await this.prismaService.type.count({ where: whereOptions });

    this.logger.log(count);

    this.logger.log(prismaOptions);

    return {
      characteristics: types,
      count: Math.ceil(count / 5),
    };
  }

  async getNationalCuisines(body: CharacteristicsQueryParamsDto) {
    let prismaOptions: any = {
      take: 5,
      skip: (body.page - 1) * 5,
    };
    const whereOptions: any = {};

    if (body.search) {
      whereOptions.name = {
        contains: body.search,
      };
      prismaOptions = {
        ...prismaOptions,
        where: whereOptions,
      };
    }

    const nationalCuisines =
      await this.prismaService.nationalCuisine.findMany(prismaOptions);

    const count = await this.prismaService.nationalCuisine.count({
      where: whereOptions,
    });

    return {
      characteristics: nationalCuisines,
      count: Math.ceil(count / 5),
    };
  }

  async getHolidays(body: CharacteristicsQueryParamsDto) {
    let prismaOptions: any = {
      take: 5,
      skip: (body.page - 1) * 5,
    };

    const whereOptions: any = {};

    if (body.search) {
      whereOptions.name = {
        contains: body.search,
      };
      prismaOptions = {
        ...prismaOptions,
        where: whereOptions,
      };
    }

    const holidays = await this.prismaService.holiday.findMany(prismaOptions);

    const count = await this.prismaService.holiday.count({
      where: whereOptions,
    });

    return {
      characteristics: holidays,
      count: Math.ceil(count / 5),
    };
  }
}
