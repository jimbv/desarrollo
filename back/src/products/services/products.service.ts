import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(
    name?: string,
    orderBy?: 'price' | 'name',
    order?: 'asc' | 'desc',
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Product>> {
    return this.productsRepository.findAll(name, orderBy, order, page, limit);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    return this.productsRepository.findByCategoryId(categoryId);
  }

  async create(input: CreateProductInput): Promise<Product> {
    try {
      this.categoriesService.findOne(input.categoryId);
    } catch {
      throw new BadRequestException('Category does not exist');
    }

    return this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    if (input.categoryId !== undefined) {
      try {
        this.categoriesService.findOne(input.categoryId);
      } catch {
        throw new BadRequestException('Category does not exist');
      }
    }

    const product = await this.productsRepository.update(id, input);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async reduceStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (quantity > product.stock) {
      throw new BadRequestException('Stock insuficiente.');
    }

    const updatedProduct = await this.productsRepository.updateStock(
      id,
      quantity,
    );

    if (!updatedProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    return updatedProduct;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }
}