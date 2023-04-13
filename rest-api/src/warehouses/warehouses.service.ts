import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { WarehouseDetailedDTO } from './dtos/warehouse-detailed.dto';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
    private readonly httpService: HttpService,
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
      await this.checkUniqueName(updateWarehouseDto.name, id);
    }

    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
      relations: ['imports', 'exports'],
    });

    if (!warehouse) {
      return new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    if (
      updateWarehouseDto.volumeLimit &&
      updateWarehouseDto.volumeLimit < warehouse.volume
    ) {
      return new BadRequestException(
        `Can not set less volume limit ${updateWarehouseDto.volumeLimit} fewer than the current volume level ${warehouse.volume}`,
      );
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

  async getByIdOrNull(id: number) {
    return this.warehouseRepo.findOne({ where: { id } });
  }

  async getCurrentProductInfo(id: number) {
    const warehouse = await this.warehouseRepo.findOne({
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

    for (const [id, quantity] of Object.entries(productInfo)) {
      if (quantity <= 0) {
        delete productInfo[id];
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

    let importProductInfo = {};
    warehouse.imports.map((imp) =>
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
    warehouse.exports.map((exp) =>
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

    for (const [id, quantity] of Object.entries(productInfo)) {
      if (quantity <= 0) {
        delete productInfo[id];
      }
    }

    return productInfo;
  }

  async checkUniqueName(name: string, id?: number) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { name },
    });

    if (warehouse && warehouse.id !== id) {
      throw new BadRequestException(
        `Warehouse with name ${name} already exists`,
      );
    }
  }

  async getWarehouseFreeVolume(warehouse: Warehouse) {
    try {
      const params = `?expr=${warehouse.volumeLimit}-${warehouse.volume}&precision=2`;
      const response = await firstValueFrom(this.httpService.get(params));
      return response.data;
    } catch (err) {
      return new InternalServerErrorException('Something went wrong');
    }
  }

  async getDetailInfo(id: number) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }

    const prodInfo = await this.getAllTimeProductInfo(id);

    const detailedWarehouseDTO = new WarehouseDetailedDTO();
    detailedWarehouseDTO.warehouseId = warehouse.id;
    detailedWarehouseDTO.productsQuantity = prodInfo;

    return detailedWarehouseDTO;
  }
}
