import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './helpers/password.service';
import { UserModule } from 'src/user/user.module';
import { TokenService } from './helpers/token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    PrismaModule,
    ConfigModule.forRoot(),
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
