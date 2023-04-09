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
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      baseURL: 'http://api.mathjs.org/v4',
    }),
    TypeOrmModule.forFeature([Movement, Warehouse, Product, MovementProduct]),
    WarehousesModule,
    ProductsModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
