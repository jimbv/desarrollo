import { ProductsService } from '../services/products.service';
import type { CreateProductInput, Product, UpdateProductInput } from '../product.types';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page?: string, limit?: string): Promise<import("../../shared/paginated-result.type").PaginateResults<Product>>;
    findByName(name: string): Promise<Product[] | undefined>;
    findOne(id: string): Promise<Product>;
    create(body: CreateProductInput): Promise<Product>;
    update(id: string, body: UpdateProductInput): Promise<Product>;
    reduceStock(id: string, stock: number): Promise<Product | undefined>;
    remove(id: string): Promise<Product | undefined>;
    orderBy(input: 'name' | 'price', order?: 'asc' | 'desc'): Promise<Product[]>;
}
