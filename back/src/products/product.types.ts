export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
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
