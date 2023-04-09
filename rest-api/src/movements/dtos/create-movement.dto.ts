import { IsArray, IsNumber, IsOptional } from 'class-validator';

interface Transfer {
  productId: number;
  quantity: number;
}

export class CreateMovementDTO {
  @IsOptional()
  @IsNumber()
  sourceId: number = -1;

  @IsOptional()
  @IsNumber()
  destinationId: number = -1;

  @IsArray()
  transfers: Transfer[];
}
