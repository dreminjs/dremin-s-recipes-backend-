import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(email: string, userId: number) {
    const refreshToken = this.jwtService.sign(email, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    const accessToken = this.jwtService.sign(email, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    await this.saveToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, token: string) {
    this.logger.log(userId);

    const refreshToken = await this.prismaService.refreshToken.create({
      data: {
        userId,
        token,
      },
    });

    return true;
  }

  async removeToken(userId: number) {
    this.logger.log(userId, 'USER ID');

    const token = await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    if (!token) {
      throw new UnauthorizedException('не авторизован!');
    }
  }
}
