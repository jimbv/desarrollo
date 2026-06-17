import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
export declare const PRODUCTS_REPOSITORY = "PRODUCTS_REPOSITORY";
export interface ProductsRepository {
    findAll(): Product[];
    findById(id: number): Product | undefined;
    create(input: CreateProductInput): Product;
    update(id: number, input: UpdateProductInput): Product | undefined;
    remove(id: number): Product | undefined;
}
