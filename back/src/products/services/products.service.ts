import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  findAll(): Product[] {
    return this.productsRepository.findAll();
  }

  findOne(id: number): Product {
    const product = this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(input: CreateProductInput): Product {
    return this.productsRepository.create(input);
  }

  update(id: number, input: UpdateProductInput): Product {
    const product = this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  remove(id: number): Product {
    const product = this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}

