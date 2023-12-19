import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
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
            user: true,
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

        this.validateWarehouseInput(
          reqMovement.sourceId,
          reqMovement.destinationId,
          sourceWarehouse,
          destinationWarehouse,
          user,
        );

        const parts = reqMovement.date.split('/');
        console.log(parts);
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10) + 1;
        const year = parseInt(parts[2], 10);

        const isoDate = new Date(year, month, day).toISOString();
        console.log(isoDate);

        let movement = queryRunner.manager.create(Movement, {
          source: sourceWarehouse,
          destination: destinationWarehouse,
          date: isoDate || new Date().toISOString(),
          products: [],
        });

        movement = await queryRunner.manager.save(movement);

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

  async getMovementsForWarehouse(warehouseId: number) {
    const movements = await this.dataSource
      .getRepository(Movement)
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.source', 'source')
      .leftJoinAndSelect('movement.destination', 'destination')
      .leftJoinAndSelect('movement.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .where(
        'movement.source.id = :sourceId OR movement.destination.id = :destId',
        { sourceId: warehouseId, destId: warehouseId },
      )
      .getMany();

    return movements;
  }

  // helper methods
  private async transferProducts(
    transfers,
    movement: Movement,
    sourceWarehouse: Warehouse,
    destinationWarehouse: Warehouse,
    queryRunner: QueryRunner,
  ) {
    const products = await this.getTransferProducts(transfers, queryRunner);
    const productsVolume = await this.calculateProductsVolume(products);

    if (sourceWarehouse !== null) {
      await this.processTransferSourceWarehouse(
        products,
        productsVolume,
        sourceWarehouse,
        queryRunner,
      );
    }

    if (destinationWarehouse !== null) {
      await this.processTransferDestinationWarehouse(
        products,
        productsVolume,
        destinationWarehouse,
        queryRunner,
      );
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

    movement = await queryRunner.manager.save(movement);

    let createdMovement = await queryRunner.manager.findOne(Movement, {
      where: { id: movement.id },
      relations: ['source', 'destination'],
    });

    createdMovement.destination = destinationWarehouse;
    createdMovement.source = sourceWarehouse;
    await queryRunner.manager.save(createdMovement);

    return movement;
  }

  private validateWarehouseInput(
    sourceId: number,
    destinationId: number,
    sourceWarehouse: Warehouse,
    destinationWarehouse: Warehouse,
    user: User,
  ) {
    if (sourceId !== -1 && !sourceWarehouse) {
      throw new BadRequestException(
        `Source warehouse with id ${sourceId} not found`,
      );
    }

    if (destinationId !== -1 && !destinationWarehouse) {
      throw new BadRequestException(
        `Destination warehouse with id ${destinationId} not found`,
      );
    }

    if (sourceId === destinationId) {
      throw new BadRequestException(
        'Source and destination warehouse could not be same',
      );
    }

    if (sourceWarehouse && sourceWarehouse.user.id !== user.id) {
      throw new UnauthorizedException('Can not import from foreign warehouse');
    }
    if (destinationWarehouse && destinationWarehouse.user.id !== user.id) {
      throw new UnauthorizedException('Can not export from foreign warehouse');
    }
    if (!sourceWarehouse && !destinationWarehouse) {
      throw new BadRequestException(
        `Provide at least one warehouse to import or export from`,
      );
    }
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

  private async calculateProductsVolume(products) {
    for (const { product, quantity } of products) {
      try {
        const params = `?expr=${product.volume}*${quantity}&precision=2`;
        const response = await firstValueFrom(this.httpService.get(params));
        return response.data;
      } catch (err) {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  private async processTransferSourceWarehouse(
    products,
    productsVolume,
    sourceWarehouse: Warehouse,
    queryRunner: QueryRunner,
  ) {
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
        throw new BadRequestException(
          `Not enough quantity of product ${product.name} in warehouse named ${sourceWarehouse.name}`,
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

  private async processTransferDestinationWarehouse(
    products,
    productsVolume,
    destinationWarehouse: Warehouse,
    queryRunner: QueryRunner,
  ) {
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
      .filter(
        (imp) =>
          new Date(imp.date).toLocaleDateString() <=
          new Date().toLocaleDateString(),
      )
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
      .filter(
        (exp) =>
          new Date(exp.date).toLocaleDateString() <=
          new Date().toLocaleDateString(),
      )
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
