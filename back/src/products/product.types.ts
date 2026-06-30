import { Category } from '../categories/category.types';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category;
};

export type CreateProductInput = {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
};

export type UpdateProductInput = {
  name?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
};