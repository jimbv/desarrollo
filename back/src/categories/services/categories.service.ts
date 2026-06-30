import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../category.types';
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
    const normalizedName = input.name.trim();

    const exists = this.categoriesRepository
      .findAll()
      .some(
        (category) =>
          category.name.trim().toLowerCase() === normalizedName.toLowerCase(),
      );

    if (exists) {
      throw new ConflictException('Category name already exists');
    }

    return this.categoriesRepository.create({
      ...input,
      name: normalizedName,
    });
  }

  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const currentCategory = this.categoriesRepository.findById(id);

    if (!currentCategory) {
      throw new NotFoundException('Category not found');
    }

    if (input.name !== undefined) {
      const normalizedName = input.name.trim();

      const exists = this.categoriesRepository
        .findAll()
        .some(
          (category) =>
            category.id !== id &&
            category.name.trim().toLowerCase() === normalizedName.toLowerCase(),
        );

      if (exists) {
        throw new ConflictException('Category name already exists');
      }

      input = {
        ...input,
        name: normalizedName,
      };
    }

    const category = this.categoriesRepository.update(id, input);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
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