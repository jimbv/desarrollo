import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import { ProductsRepository } from './products.repository';
export declare class InMemoryProductsRepository implements ProductsRepository {
    private products;
    private nextId;
    findAll(): Product[];
    findById(id: number): Product | undefined;
    create(input: CreateProductInput): Product;
    update(id: number, input: UpdateProductInput): Product | undefined;
    remove(id: number): Product | undefined;
}
