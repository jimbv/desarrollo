import {
  CATEGORIES_REPOSITORY,
  type CategoriesRepository,
} from '../repositories/categories.repository';
import type { Category, CreateCategoryInput } from '../categories.types';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  findAll(): Category[] {
    return this.categoriesRepository.findAll();
  }

  findById(id: number): Category | undefined {
    return this.categoriesRepository.findById(id);
  }

  create(input: CreateCategoryInput): Category {
    return this.categoriesRepository.create(input);
  }

  remove(id: number): Category {
    return this.categoriesRepository.remove(id);
  }
}
