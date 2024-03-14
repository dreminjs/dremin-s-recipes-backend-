import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CharacteristicDto } from 'src/characteristics/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  private logger = new Logger(AdminService.name);

  async isAdmin(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    return user.role === 'ADMIN' && true;
  }

  async createType(body: CharacteristicDto) {
    return await this.prismaService.type.create({
      data: {
        name: body.name,
      },
    });
  }

  async createHoliday(body: CharacteristicDto) {
    return await this.prismaService.holiday.create({
      data: {
        name: body.name,
      },
    });
  }

  async createNationalCuisine(body: CharacteristicDto) {
    return await this.prismaService.nationalCuisine.create({
      data: {
        name: body.name,
      },
    });
  }

  async editType(name: string, id: number) {
    this.logger.log(name);

    const type = await this.prismaService.type.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    this.logger.log(type);

    if (!type) {
      throw new NotFoundException('такого типа нет!');
    }

    return type;
  }

  async editHoliday(name: string, id: number) {
    const holiday = await this.prismaService.holiday.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    if (!holiday) {
      throw new NotFoundException('такого праздника нет!');
    }

    return holiday;
  }
  async editNationalCuisine(name: string, id: number) {
    const nationalCuisine = await this.prismaService.nationalCuisine.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    if (!nationalCuisine) {
      throw new NotFoundException('такой кухни нет!');
    }

    return nationalCuisine;
  }
}
