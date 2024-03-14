import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PasswordService } from './helpers/password.service';
import { TokenService } from './helpers/token.service';

import * as uuid from 'uuid';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(body: SignUpDto) {
    const salt = await bcrypt.genSalt();

    const hashPassword = await this.passwordService.hashPassword(
      body.password,
      salt,
    );

    const activationLink = uuid.v4();

    const user = await this.prismaService.user.create({
      data: {
        username: body.username,
        hashPassword: hashPassword,
        email: body.email,
        salt,
        activationLink: activationLink,
      },
    });

    return user;
  }

  async logout(userId: number): Promise<void> {
    this.logger.log(userId);

    await this.tokenService.removeToken(userId);
  }

  async confirmAccount(link: string) {
    const user = await this.prismaService.user.update({
      where: {
        activationLink: link,
      },
      data: {
        isActivated: true,
      },
    });

    return {
      message: 'вы успешно подтвердили аккаунт!',
    };
  }
}
