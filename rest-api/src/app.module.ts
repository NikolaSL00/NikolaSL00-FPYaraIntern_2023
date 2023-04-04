import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Warehouse } from './warehouses/warehouse.entity';
import { Product } from './products/product.entity';

@Module({
  imports: [
    UsersModule,
    WarehousesModule,
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'warehouses',
      entities: [User, Warehouse, Product],
      synchronize: true,
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
