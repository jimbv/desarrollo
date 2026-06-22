import { Category, CreateCategoryInput } from '../category.types';
import { CategoriesRepository } from './categories.repository';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = [];
  private nextId = 1;

  findAll(): Category[] {
    return this.categories;
  }

  findById(id: number): Category | undefined {
    return this.categories.find((category) => category.id === id);
  }

  create(input: CreateCategoryInput): Category {
    const category: Category = {
      id: this.nextId++,
      name: input.name,
    };

    this.categories.push(category);
    return category;
  }

  remove(id: number): Category | undefined {
    const category = this.findById(id);

    if (!category) {
      return undefined;
    }

    this.categories = this.categories.filter((c) => c.id !== id);
    return category;
  }
}