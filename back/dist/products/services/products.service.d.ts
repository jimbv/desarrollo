import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import { ProductsRepository } from '../repositories/products.repository';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    findAll(): Product[];
    findOne(id: number): Product;
    create(input: CreateProductInput): Product;
    update(id: number, input: UpdateProductInput): Product;
    remove(id: number): Product;
}
