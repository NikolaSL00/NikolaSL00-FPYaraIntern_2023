import { IsArray, IsNumber } from 'class-validator';

interface Transfer {
  productId: number;
  quantity: number;
}

export class CreateMovementDTO {
  @IsNumber()
  sourceId: number;

  @IsNumber()
  destinationId: number;

  @IsArray()
  transfers: Transfer[];
}
