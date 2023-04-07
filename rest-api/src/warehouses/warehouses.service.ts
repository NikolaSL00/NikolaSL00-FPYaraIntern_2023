import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
  ) {}

  async create(user: User, warehouse: Partial<Warehouse>) {
    await this.checkUniqueName(warehouse.name);
    const newWarehouse = this.warehouseRepo.create({
      ...warehouse,
      user,
    });

    newWarehouse.volume = 0;

    return this.warehouseRepo.save(newWarehouse);
  }

  findAllUserWarehouses(user: User) {
    const warehouses = this.warehouseRepo
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    return warehouses;
  }

  async update(id: number, updateWarehouseDto: Partial<Warehouse>) {
    if (updateWarehouseDto.name) {
      await this.checkUniqueName(updateWarehouseDto.name);
    }

    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
      relations: ['imports'],
    });

    if (!warehouse) {
      return new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    const productInfo = await this.getCurrentProductInfo(id);
    const productsCount = Object.values(productInfo).reduce(
      (acc: number, value: number) => acc + value,
      0,
    );

    if (
      updateWarehouseDto.type &&
      updateWarehouseDto.type !== warehouse.type &&
      productsCount > 0
    ) {
      return new BadRequestException(
        'Can not change the warehouse type, when it has products',
      );
    }

    warehouse.name = updateWarehouseDto.name ?? warehouse.name;
    warehouse.address = updateWarehouseDto.address ?? warehouse.address;
    warehouse.volume = updateWarehouseDto.volume ?? warehouse.volume;
    warehouse.volumeLimit =
      updateWarehouseDto.volumeLimit ?? warehouse.volumeLimit;
    warehouse.type = updateWarehouseDto.type ?? warehouse.type;

    return this.warehouseRepo.save(warehouse);
  }

  async remove(warehouseId: number) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      return new NotFoundException(
        `Warehouse with ID ${warehouseId} not found`,
      );
    }

    await this.warehouseRepo.remove(warehouse);
  }

  async getCurrentProductInfo(id: number) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
      relations: {
        imports: { products: { movement: true, product: true } },
        exports: { products: { movement: true, product: true } },
      },
    });

    const importProductInfo = warehouse.imports
      .filter((imp) => imp.date <= new Date().toLocaleDateString())
      .map((imp) =>
        imp.products.reduce((acc, mov_prod) => {
          if (acc[mov_prod.product.id]) {
            acc[mov_prod.product.id] += mov_prod.quantity;
          } else {
            acc[mov_prod.product.id] = mov_prod.quantity;
          }
          return acc;
        }, {}),
      )[0];

    const exportProductInfo = warehouse.exports
      .filter((exp) => exp.date <= new Date().toLocaleDateString())
      .map((exp) =>
        exp.products.reduce((acc, mov_prod) => {
          if (acc[mov_prod.product.id]) {
            acc[mov_prod.product.id] -= mov_prod.quantity;
          } else {
            acc[mov_prod.product.id] = -mov_prod.quantity;
          }
          return acc;
        }, {}),
      )[0];

    const productInfo = {};
    for (const key in importProductInfo) {
      productInfo[key] = importProductInfo[key];

      if (exportProductInfo[key]) {
        productInfo[key] += exportProductInfo[key];
      }
    }

    return productInfo;
  }

  async getAllTimeProductInfo(id: number) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
      relations: {
        imports: { products: { movement: true, product: true } },
        exports: { products: { movement: true, product: true } },
      },
    });

    const importProductInfo = warehouse.imports.map((imp) =>
      imp.products.reduce((acc, mov_prod) => {
        if (acc[mov_prod.product.id]) {
          acc[mov_prod.product.id] += mov_prod.quantity;
        } else {
          acc[mov_prod.product.id] = mov_prod.quantity;
        }
        return acc;
      }, {}),
    )[0];

    const exportProductInfo = warehouse.exports.map((exp) =>
      exp.products.reduce((acc, mov_prod) => {
        if (acc[mov_prod.product.id]) {
          acc[mov_prod.product.id] -= mov_prod.quantity;
        } else {
          acc[mov_prod.product.id] = -mov_prod.quantity;
        }
        return acc;
      }, {}),
    )[0];

    const productInfo = {};
    for (const key in importProductInfo) {
      productInfo[key] = importProductInfo[key];

      if (exportProductInfo[key]) {
        productInfo[key] += exportProductInfo[key];
      }
    }

    return productInfo;
  }

  async checkUniqueName(name: string) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { name },
    });
    if (warehouse) {
      throw new BadRequestException(
        `Warehouse with name ${name} already exists`,
      );
    }
  }
}
