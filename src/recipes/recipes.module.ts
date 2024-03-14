import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from './middlewares/uplaod.middleware';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    }),
    PrismaModule,
  ],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
