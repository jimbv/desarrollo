import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';
import type { ProductsRepository } from '../repositories/products.repository';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { PaginateResults } from 'src/shared/paginated-result.type';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}
  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginateResults<Product>> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({ id });
    return product ?? undefined;
  }
  async findByName(name: string): Promise<Product[]> {
    return this.repository.findBy({ name });
  }
  async create(input: CreateProductInput): Promise<Product> {
    const product = this.repository.create(input);
    return this.repository.save(product);
  }
  async update(
    id: number,
    input: UpdateProductInput,
  ): Promise<Product | undefined> {
    const product = await this.repository.findOneBy({ id });

    if (!product) {
      return undefined;
    }

    Object.assign(product, input);

    return await this.repository.save(product);
  }
  async reduceStock(id: number, stock: number): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    product.stock -= stock;
    return this.repository.save(product);
  }
  async remove(id: number): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    await this.repository.remove(product);
    return product;
  }
  async OrderBy(
    input: 'name' | 'price',
    order: 'asc' | 'desc' = 'asc',
  ): Promise<Product[]> {
    return this.repository.find({
      order: {
        [input]: order.toUpperCase() as 'ASC' | 'DESC',
      },
    });
  }
}
