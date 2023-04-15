import { Expose, Transform } from 'class-transformer';

export class GetMovementsDTO {
  @Expose()
  id: number;

  @Expose()
  date: string;

  @Transform(({ obj }) => {
    if (!obj.source) {
      return null;
    }
    return obj.source.id;
  })
  @Expose()
  sourceId: number;

  @Transform(({ obj }) => {
    if (!obj.source) {
      return 'external source';
    }
    return obj.source.name;
  })
  @Expose()
  sourceName: string;

  @Transform(({ obj }) => {
    if (!obj.destination) {
      return null;
    }
    return obj.destination.id;
  })
  @Expose()
  destinationId: number;

  @Transform(({ obj }) => {
    if (!obj.destination) {
      return 'external destination';
    }
    return obj.destination.name;
  })
  @Expose()
  destinationName: string;

  @Transform(({ obj }) => {
    const final = [];

    for (let product of obj.products) {
      final.push({ quantity: product.quantity, productId: product.product.id });
    }

    return final;
  })
  @Expose()
  products: [];
}
