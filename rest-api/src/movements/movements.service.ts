import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MovementProduct } from 'src/junction-table/movement-product.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Warehouse } from 'src/warehouses/warehouse.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateMovementDTO } from './dtos/create-movement.dto';
import { Movement } from './movement.entity';

@Injectable()
export class MovementsService {
  constructor(
    private dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async addMovement(reqMovement: CreateMovementDTO, user: User) {
    return await this.dataSource.manager.transaction(async (entityManager) => {
      const queryRunner = this.dataSource.createQueryRunner();
      queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const sourceWarehouse = await queryRunner.manager.findOne(Warehouse, {
          where: { id: reqMovement.sourceId },
          relations: {
            imports: { products: { movement: true, product: true } },
            exports: { products: { movement: true, product: true } },
          },
        });

        const destinationWarehouse = await queryRunner.manager.findOne(
          Warehouse,
          {
            where: { id: reqMovement.destinationId },
            relations: {
              user: true,
              imports: { products: { movement: true, product: true } },
              exports: { products: { movement: true, product: true } },
            },
          },
        );

        if (sourceWarehouse && sourceWarehouse.user.id !== user.id) {
          return new UnauthorizedException(
            'Can not import from foreign warehouse',
          );
        }
        if (destinationWarehouse && destinationWarehouse.user.id !== user.id) {
          return new UnauthorizedException(
            'Can not export from foreign warehouse',
          );
        }

        if (!sourceWarehouse && !destinationWarehouse) {
          return new BadRequestException(
            `Provide at least one warehouse to import or export from`,
          );
        }

        const movement = queryRunner.manager.create(Movement, {
          source: sourceWarehouse,
          destination: destinationWarehouse,
          date: reqMovement.date || new Date().toLocaleDateString(),
        });

        await this.transferProducts(
          reqMovement.transfers,
          movement,
          sourceWarehouse,
          destinationWarehouse,
          queryRunner,
        );

        await queryRunner.commitTransaction();
        return movement;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      }
    });
  }

  private async transferProducts(
    transfers,
    movement: Movement,
    sourceWarehouse: Warehouse,
    destinationWarehouse: Warehouse,
    queryRunner: QueryRunner,
  ) {
    movement.products = [];
    await queryRunner.manager.save(movement);
    const products = await this.getTransferProducts(transfers, queryRunner);

    let productsVolume = 0;
    for (const { product, quantity } of products) {
      try {
        const params = `?expr=${product.volume}*${quantity}&precision=2`;
        const response = await firstValueFrom(this.httpService.get(params));
        productsVolume += response.data;
      } catch (err) {
        throw new InternalServerErrorException('Something went wrong');
      }
    }

    if (sourceWarehouse) {
      // SOURCE
      const sourceProdInfo = await this.getCurrentProductInfoOfWarehouse(
        sourceWarehouse.id,
        queryRunner,
      );
      // check source warehouse product qty
      for (const { product, quantity } of products) {
        if (
          !sourceProdInfo[product.id] ||
          sourceProdInfo[product.id] < quantity
        ) {
          throw new HttpException(
            `Not enough quantity in warehouse named ${sourceWarehouse.name} of product ${product.name}`,
            400,
          );
        }
      }

      let newSourceVolume;
      try {
        const params = `?expr=${sourceWarehouse.volume}-${productsVolume}&precision=2`;
        const response = await firstValueFrom(this.httpService.get(params));
        newSourceVolume = response.data;
      } catch (err) {
        throw new InternalServerErrorException('Something went wrong');
      }
      sourceWarehouse.volume = newSourceVolume;
      queryRunner.manager.save(sourceWarehouse);
    }

    if (destinationWarehouse) {
      // DESTINATION
      // #1 each product.type === destination.type
      for (const { product, _ } of products) {
        if (product.type !== destinationWarehouse.type) {
          throw new BadRequestException(
            `Can not supply warehouse of ${destinationWarehouse.type} type with product of ${product.type} type`,
          );
        }
      }

      let destinationFreeVolume;
      try {
        const params = `?expr=${destinationWarehouse.volumeLimit}-${destinationWarehouse.volume}&precision=2`;
        const response = await firstValueFrom(this.httpService.get(params));
        destinationFreeVolume = response.data;
      } catch (err) {
        throw new InternalServerErrorException('Something went wrong');
      }

      // #3 capacity freeLimit in destination > volume of all products
      if (destinationFreeVolume < productsVolume) {
        throw new BadRequestException(
          `Destination warehouse with id ${destinationWarehouse.id} capacity has not enough volume capacity`,
        );
      }

      let newDestinationVolume;
      try {
        const params = `?expr=${destinationWarehouse.volume}%2B${productsVolume}&precision=2`;
        const response = await firstValueFrom(this.httpService.get(params));
        newDestinationVolume = response.data;
      } catch (err) {
        throw new InternalServerErrorException('Something went wrong');
      }

      destinationWarehouse.volume = newDestinationVolume;
      queryRunner.manager.save(destinationWarehouse);
    }

    for (let { product, quantity } of products) {
      const movementProduct = queryRunner.manager.create(MovementProduct, {
        product,
        quantity,
        movement,
      });
      await queryRunner.manager.save(movementProduct);

      movement.products.push(movementProduct);
    }

    await queryRunner.manager.save(movement);
    return movement;
  }

  private async getTransferProducts(transfers, queryRunner: QueryRunner) {
    const products = [];

    for (let { productId, quantity } of transfers) {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      products.push({ product, quantity });
    }

    return products;
  }

  private async getCurrentProductInfoOfWarehouse(
    id: number,
    queryRunner: QueryRunner,
  ) {
    const warehouse = await queryRunner.manager.findOne(Warehouse, {
      where: { id },
      relations: {
        imports: { products: { movement: true, product: true } },
        exports: { products: { movement: true, product: true } },
      },
    });

    let importProductInfo = {};
    warehouse.imports
      .filter((imp) => imp.date <= new Date().toLocaleDateString())
      .map((imp) =>
        imp.products.reduce((acc, mov_prod) => {
          if (acc[mov_prod.product.id]) {
            acc[mov_prod.product.id] += mov_prod.quantity;
          } else {
            acc[mov_prod.product.id] = mov_prod.quantity;
          }
          return acc;
        }, importProductInfo),
      )[0];

    let exportProductInfo = {};
    warehouse.exports
      .filter((exp) => exp.date <= new Date().toLocaleDateString())
      .map((exp) =>
        exp.products.reduce((acc, mov_prod) => {
          if (acc[mov_prod.product.id]) {
            acc[mov_prod.product.id] -= mov_prod.quantity;
          } else {
            acc[mov_prod.product.id] = -mov_prod.quantity;
          }
          return acc;
        }, exportProductInfo),
      )[0];

    const productInfo = {};
    for (const key in importProductInfo) {
      productInfo[key] = importProductInfo[key];

      if (exportProductInfo?.[key]) {
        productInfo[key] += exportProductInfo[key];
      }
    }

    return productInfo;
  }
}
