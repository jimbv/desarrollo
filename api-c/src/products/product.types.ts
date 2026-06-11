export type Product = {
  id: number;
  name: string;
  price: number;
};

export type CreateProductInput = {
  name: string;
  price: number;
};

export type UpdateProductInput = {
  name?: string;
  price?: number;
};
