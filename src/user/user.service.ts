import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    return user;
  }
}
