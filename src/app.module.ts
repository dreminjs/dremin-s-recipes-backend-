import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RecipesModule } from './recipes/recipes.module';
import { CharacteristicsModule } from './characteristics/characteristics.module';
import { AdminModule } from './admin/admin.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    UserModule,
    RecipesModule,
    CharacteristicsModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
})
export class AppModule {}
