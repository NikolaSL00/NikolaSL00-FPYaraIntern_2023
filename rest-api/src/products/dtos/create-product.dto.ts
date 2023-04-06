import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ProductType } from './enums/product-type.enum';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  length: number;

  @IsNumber()
  price: number;

  @IsEnum(ProductType)
  type: ProductType;
}
