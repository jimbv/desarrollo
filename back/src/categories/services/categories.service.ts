import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, CreateCategoryInput } from '../category.types';
import {
  CATEGORIES_REPOSITORY,
  CategoriesRepository,
} from '../repositories/categories.repository';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  findAll(): Category[] {
    return this.categoriesRepository.findAll();
  }

  findOne(id: number): Category {
    const category = this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  create(input: CreateCategoryInput): Category {
    return this.categoriesRepository.create(input);
  }

  async remove(id: number): Promise<Category> {
    const category = this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const products = await this.productsService.findByCategoryId(id);

    if (products.length > 0) {
      throw new ConflictException(
        'Cannot delete category with associated products',
      );
    }

    const deletedCategory = this.categoriesRepository.remove(id);

    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }

    return deletedCategory;
  }
}