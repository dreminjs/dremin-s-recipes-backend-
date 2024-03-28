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

  async findUserByRefreshToken(token: string) {
    const user = await this.prismaService.refreshToken.findFirst({
      where: { token },
    });

    return user;
  }

  async findUserById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    return user;
  }

  async checkOwnerProfile(profileId: number, userId: number) {
    const userProfile = await this.prismaService.user.findFirst({
      where: { id: profileId },
    });

    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    this.logger.log(profileId, userId);

    return { isMineProfile: userProfile.id == user.id };
  }
}
