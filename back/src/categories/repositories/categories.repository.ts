import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(): Category[];
  findById(id: number): Category | undefined;
  findByName(name: string): Category | undefined;
  create(input: CreateCategoryInput): Category;
  update(id: number, input: UpdateCategoryInput): Category | undefined;
  remove(id: number): Category | undefined;
}