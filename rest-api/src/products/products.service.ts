import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly httpService: HttpService,
  ) {}

  async create(product: Partial<Product>) {
    const { name, length, width, height } = product;

    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });

    if (existingProduct) {
      return new BadRequestException(
        `Product with name ${name} already exists`,
      );
    }

    try {
      const params = `/?expr=${length}*${width}*${height}&precision=2`;
      const response = await firstValueFrom(this.httpService.get(params));
      product.volume = response.data;
    } catch (err) {
      return new InternalServerErrorException(
        'Something went wrong with the creation of the product',
      );
    }
    const created = this.productRepository.create(product);
    return this.productRepository.save(created);
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
