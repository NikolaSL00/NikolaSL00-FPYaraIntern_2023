import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Warehouse } from 'src/warehouses/warehouse.entity';
import { Movement } from './movement.entity';
import { MovementProduct } from '../junction-table/movement-product.entity';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement, Warehouse, Product, MovementProduct]),
    WarehousesModule,
    ProductsModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
