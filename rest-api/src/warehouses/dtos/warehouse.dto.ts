import { Expose, Transform } from 'class-transformer';
import { WarehouseType } from './enums/warehouse-type.enum';

export class WarehouseDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  volumeLimit: number;

  @Expose()
  volume: number;

  @Expose()
  type: WarehouseType;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
