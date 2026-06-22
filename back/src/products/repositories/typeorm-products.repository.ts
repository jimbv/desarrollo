import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { PaginatedResult } from '../../common/types/paginated-result.type';
import { ProductsRepository } from './products.repository';
import { ProductEntity } from '../product.entity';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(
    name?: string,
    orderBy?: 'price' | 'name',
    order: 'asc' | 'desc' = 'asc',
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<Product>> {
    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 50 ? 50 : limit;
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await this.repo.findAndCount({
      where: name ? { name: Like(`%${name}%`) } : {},
      order: orderBy
        ? {
            [orderBy]: order.toUpperCase() as 'ASC' | 'DESC',
          }
        : {},
      skip,
      take: safeLimit,
    });

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.repo.findOne({ where: { id } });
    return product ?? undefined;
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    return this.repo.find({
      where: { categoryId },
    });
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.repo.create(input);
    return this.repo.save(product);
  }

  async update(
    id: number,
    input: UpdateProductInput,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);

    if (!product) {
      return undefined;
    }

    const updatedProduct = this.repo.merge(product, input);
    return this.repo.save(updatedProduct);
  }

  async updateStock(
    id: number,
    quantity: number,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);

    if (!product) {
      return undefined;
    }

    product.stock -= quantity;
    return this.repo.save(product);
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.findById(id);

    if (!product) {
      return undefined;
    }

    await this.repo.remove(product);
    return product;
  }
}