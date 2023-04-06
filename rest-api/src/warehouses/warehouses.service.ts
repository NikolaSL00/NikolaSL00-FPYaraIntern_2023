import {
  BadRequestException,
  HttpCode,
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
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  create(user: User, warehouse: Partial<Warehouse>) {
    const newWarehouse = this.warehouseRepository.create({
      ...warehouse,
      user,
    });

    newWarehouse.volume = 0;

    return this.warehouseRepository.save(newWarehouse);
  }

  findUserWarehouses(user: User) {
    const warehouses = this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    return warehouses;
  }

  async update(id: number, updateWarehouseDto: Partial<Warehouse>) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: { products: true },
    });

    if (!warehouse) {
      return new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    warehouse.name = updateWarehouseDto.name ?? warehouse.name;
    warehouse.address = updateWarehouseDto.address ?? warehouse.address;
    warehouse.volume = updateWarehouseDto.volume ?? warehouse.volume;
    warehouse.volumeLimit =
      updateWarehouseDto.volumeLimit ?? warehouse.volumeLimit;

    if (
      updateWarehouseDto.type &&
      updateWarehouseDto.type !== warehouse.type &&
      warehouse.products.length > 0
    ) {
      return new BadRequestException(
        'Can not change the warehouse type, when it is not empty',
      );
    }
    warehouse.type = updateWarehouseDto.type ?? warehouse.type;

    return this.warehouseRepository.save(warehouse);
  }

  async remove(warehouseId: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      return new NotFoundException(
        `Warehouse with ID ${warehouseId} not found`,
      );
    }

    await this.warehouseRepository.remove(warehouse);
  }
}
