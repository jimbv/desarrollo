import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  findAll(): Product[] {
    return this.products;
  }

  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  create(input: CreateProductInput): Product {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
    };

    this.products.push(product);
    return product;
  }

  update(id: number, input: UpdateProductInput): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;

    return product;
  }

  remove(id: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }
}

