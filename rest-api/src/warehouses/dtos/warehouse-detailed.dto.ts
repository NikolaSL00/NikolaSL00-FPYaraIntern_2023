import { Expose } from 'class-transformer';

export class WarehouseDetailedDTO {
  @Expose()
  warehouseId: number;

  @Expose()
  productsQuantity: {};
}
