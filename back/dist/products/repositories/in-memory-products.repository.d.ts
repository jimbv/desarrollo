import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import { ProductsRepository } from './products.repository';
import type { PaginateResults } from '../../shared/paginated-result.type';
export declare class InMemoryProductsRepository implements ProductsRepository {
    private products;
    private nextId;
    findAll(page: number, limit: number): Promise<PaginateResults<Product>>;
    findByName(name: string): Promise<Product[]>;
    findById(id: number): Promise<Product | undefined>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
    reduceStock(id: number, stock: number): Promise<Product>;
    remove(id: number): Promise<Product | undefined>;
    OrderBy(input: 'name' | 'price', order?: 'asc' | 'desc'): Promise<Product[]>;
}
