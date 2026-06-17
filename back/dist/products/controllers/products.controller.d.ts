import { ProductsService } from '../services/products.service';
import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Product[];
    findOne(id: string): Product;
    create(body: CreateProductInput): Product;
    update(id: string, body: UpdateProductInput): Product;
    remove(id: string): Product;
}
