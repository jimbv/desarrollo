import { Product } from '../product.types';
import type { PaginateResults } from '../../shared/paginated-result.type';
import type { ProductsRepository } from '../repositories/products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    findAll(page?: number, limit?: number): Promise<PaginateResults<Product>>;
    findByName(name: string): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(input: CreateProductDto): Promise<Product>;
    update(id: number, input: UpdateProductDto): Promise<Product>;
    reduceStock(id: number, stock: number): Promise<Product | undefined>;
    remove(id: number): Promise<Product | undefined>;
    orderBy(input: 'name' | 'price', order?: 'asc' | 'desc'): Promise<Product[]>;
}
