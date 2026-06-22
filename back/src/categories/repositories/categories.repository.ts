import { Category, CreateCategoryInput } from '../category.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(): Category[];
  findById(id: number): Category | undefined;
  create(input: CreateCategoryInput): Category;
  remove(id: number): Category | undefined;
}