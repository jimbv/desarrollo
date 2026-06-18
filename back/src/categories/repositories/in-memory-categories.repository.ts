import { CategoriesRepository } from './categories.repository';
import { Category, CreateCategoryInput } from '../categories.types';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = [
    { id: 1, name: 'Bebidas' },
    { id: 2, name: 'Snacks' },
    { id: 3, name: 'Dulces' },
  ];
  private nextId = this.categories.length + 1;

  findAll(): Category[] {
    return this.categories;
  }

  findById(id: number): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  create(input: CreateCategoryInput): Category {
    const newCategory: Category = {
      id: this.nextId++,
      name: input.name,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  remove(id: number): Category {
    this.categories = this.categories.filter((c) => c.id !== id);
    return this.categories.find((c) => c.id === id)!;
  }
}
