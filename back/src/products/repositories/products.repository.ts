import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { PaginatedResult } from '../../common/types/paginated-result.type';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(
    name?: string,
    orderBy?: 'price' | 'name',
    order?: 'asc' | 'desc',
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Product>>;

  findById(id: number): Promise<Product | undefined>;

  findByCategoryId(categoryId: number): Promise<Product[]>;

  create(input: CreateProductInput): Promise<Product>;

  update(id: number, input: UpdateProductInput): Promise<Product | undefined>;

  updateStock(id: number, quantity: number): Promise<Product | undefined>;

  remove(id: number): Promise<Product | undefined>;
}