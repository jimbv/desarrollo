import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';
import type { PaginateResults } from '../../shared/paginated-result.type';
export interface ProductsRepository {
  findAll(page: number, limit: number): Promise<PaginateResults<Product>>;

  findByName(name: string): Promise<Product[]>;

  findById(id: number): Promise<Product | undefined>;

  create(input: CreateProductInput): Promise<Product>;

  update(id: number, input: UpdateProductInput): Promise<Product | undefined>;

  reduceStock(id: number, stock: number): Promise<Product | undefined>;

  remove(id: number): Promise<Product | undefined>;

  OrderBy(input: 'name' | 'price', order?: 'asc' | 'desc'): Promise<Product[]>;
}
