import { IsString, IsNumber, IsEnum } from 'class-validator';
import { WarehouseType } from './enums/warehouse-type.enum';

export class CreateWarehouseDTO {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  volumeLimit: number;

  @IsEnum(WarehouseType)
  type: WarehouseType;
}
