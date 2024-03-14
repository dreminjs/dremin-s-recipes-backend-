import { Module } from '@nestjs/common';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
})
export class CharacteristicsModule {}
