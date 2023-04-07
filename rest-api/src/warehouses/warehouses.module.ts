import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from './warehouse.entity';
import { Movement } from 'src/movements/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Movement])],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
