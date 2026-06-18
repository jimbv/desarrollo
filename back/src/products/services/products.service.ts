import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Product } from '../product.types';

import type { PaginateResults } from '../../shared/paginated-result.type';
import { PRODUCTS_REPOSITORY } from '../repositories/products.repository';
import type { ProductsRepository } from '../repositories/products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findAll(page = 1, limit = 10): Promise<PaginateResults<Product>> {
    if (page < 1) page = 1;

    if (limit < 1) limit = 10;

    if (limit > 50) limit = 50;

    return await this.productsRepository.findAll(page, limit);
  }

  async findByName(name: string): Promise<Product[]> {
    return await this.productsRepository.findByName(name);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(input: CreateProductDto): Promise<Product> {
    return await this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async reduceStock(id: number, stock: number): Promise<Product | undefined> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < stock)
      throw new BadRequestException('Not enough stock');
    return await this.productsRepository.reduceStock(id, stock);
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async orderBy(
    input: 'name' | 'price',
    order?: 'asc' | 'desc',
  ): Promise<Product[]> {
    return await this.productsRepository.OrderBy(input, order);
  }
}
