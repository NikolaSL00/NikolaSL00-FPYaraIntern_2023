import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateWarehouseDTO } from './dtos/create-warehouse.dto';
import { WarehouseUpdateDTO } from './dtos/update-warehouse.dto';
import { WarehouseDetailedDTO } from './dtos/warehouse-detailed.dto';
import { WarehouseDTO } from './dtos/warehouse.dto';
import { WarehousesService } from './warehouses.service';

@Controller('warehouses')
@UseGuards(AuthGuard)
export class WarehousesController {
  constructor(private warehouseService: WarehousesService) {}

  @Post()
  @Serialize(WarehouseDTO)
  createWarehouse(@CurrentUser() user: User, @Body() body: CreateWarehouseDTO) {
    return this.warehouseService.create(user, body);
  }

  @Get()
  @Serialize(WarehouseDTO)
  getUserWarehouses(@CurrentUser() user: User) {
    return this.warehouseService.findAllUserWarehouses(user);
  }

  @Patch('/:id')
  @Serialize(WarehouseDTO)
  updateWarehouse(@Param('id') id: string, @Body() body: WarehouseUpdateDTO) {
    return this.warehouseService.update(parseInt(id), body);
  }

  @Delete('/:id')
  @Serialize(WarehouseDTO)
  deleteWarehouse(@Param('id') id: string) {
    return this.warehouseService.remove(parseInt(id));
  }

  @Get('/:id/prodInfo')
  @Serialize(WarehouseDetailedDTO)
  getDetailInfo(@Param('id') id: string) {
    return this.warehouseService.getDetailInfo(parseInt(id));
  }
}
