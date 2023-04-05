import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  addProduct(@Body() body: CreateProductDTO) {
    return this.productService.create(body);
  }

  @Get()
  getAllProducts() {
    return this.productService.findAll();
  }

  @Get('/:id')
  getProduct(@Param('id') id: number) {
    return this.productService.findOne(id);
  }
}
