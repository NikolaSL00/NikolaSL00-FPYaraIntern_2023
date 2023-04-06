import { Expose } from 'class-transformer';

export class ProductDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  width: number;

  @Expose()
  length: number;

  @Expose()
  height: number;

  @Expose()
  volume: number;

  @Expose()
  price: number;

  @Expose()
  type: string;
}
