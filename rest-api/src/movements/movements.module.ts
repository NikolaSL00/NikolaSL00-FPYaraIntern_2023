import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movement])],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
