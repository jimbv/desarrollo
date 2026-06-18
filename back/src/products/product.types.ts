export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export type CreateProductInput = {
  name: string;
  price: number;
  stock: number;
};

export type UpdateProductInput = {
  name?: string;
  price?: number;
  stock?: number;
};
