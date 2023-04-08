import { Expose, Transform } from 'class-transformer';
import { MovementProduct } from 'src/junction-table/movement-product.entity';

export class MovementDTO {
  @Expose()
  id: number;

  @Transform(({ obj }) => obj.source.id)
  @Expose()
  sourceId: number;

  @Transform(({ obj }) => obj.destination.id)
  @Expose()
  destinationId: number;

  @Transform(({ obj }) => {
    return obj.products.map((el: MovementProduct) => {
      return { quantity: el.quantity, productId: el.product.id };
    });
  })
  @Expose()
  products: MovementProduct[];

  @Expose()
  date: string;
}
