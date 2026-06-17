import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import type { PaginateResults } from '../../shared/paginated-result.type';
import type { ProductsRepository } from '../repositories/products.repository';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    findAll(page?: number, limit?: number): Promise<PaginateResults<Product>>;
    findByName(name: string): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product>;
    reduceStock(id: number, stock: number): Promise<Product | undefined>;
    remove(id: number): Promise<Product | undefined>;
    orderBy(input: 'name' | 'price', order?: 'asc' | 'desc'): Promise<Product[]>;
}
