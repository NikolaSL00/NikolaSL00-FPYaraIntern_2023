import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ProductType } from './enums/product-type.enum';

// name, width, height, length, price, type
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
