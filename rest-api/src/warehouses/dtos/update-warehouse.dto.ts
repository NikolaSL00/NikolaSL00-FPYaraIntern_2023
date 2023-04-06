import { IsEnum, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { WarehouseType } from './enums/warehouse-type.enum';

export class WarehouseUpdateDTO {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsPositive()
  volumeLimit?: number;

  @IsOptional()
  @IsEnum(WarehouseType)
  type?: WarehouseType;
}
