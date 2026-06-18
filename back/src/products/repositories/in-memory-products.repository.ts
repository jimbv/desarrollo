import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';
import type { PaginateResults } from '../../shared/paginated-result.type';
export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Cafe',
      price: 250,
      stock: 200,
    },
    {
      id: 2,
      name: 'Leche',
      price: 150,
      stock: 50,
    },
    {
      id: 3,
      name: 'Azucar',
      price: 120,
      stock: 30,
    },
    {
      id: 4,
      name: 'Cafe Premium',
      price: 450,
      stock: 20,
    },
    {
      id: 5,
      name: 'Galletitas',
      price: 300,
      stock: 50,
    },
    {
      id: 6,
      name: 'Cafe con Leche',
      price: 350,
      stock: 100,
    },
  ];
  private nextId = 1;

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginateResults<Product>> {
    const start = (page - 1) * limit;

    const data = this.products.slice(start, start + limit);

    const total = this.products.length;

    const totalPages = Math.ceil(total / limit);

    return await Promise.resolve({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }

  async findByName(name: string): Promise<Product[]> {
    return await Promise.resolve(
      this.products.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase()),
      ),
    );
  }

  async findById(id: number): Promise<Product | undefined> {
    return await Promise.resolve(this.products.find((p) => p.id === id));
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock,
    };

    this.products.push(product);
    return await Promise.resolve(product);
  }

  async update(
    id: number,
    input: UpdateProductInput,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;
    return await Promise.resolve(product);
  }

  async reduceStock(id: number, stock: number): Promise<Product> {
    const product = await this.findById(id);
    if (!product) throw new Error('Product not found');

    product.stock -= stock;
    return await Promise.resolve(product);
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return await Promise.resolve(product);
  }

  async OrderBy(
    input: 'name' | 'price',
    order?: 'asc' | 'desc',
  ): Promise<Product[]> {
    const sortedProducts = [...this.products].sort((a, b) => {
      if (input === 'name') {
        if (order === 'desc') {
          return b.name.localeCompare(a.name);
        }

        return a.name.localeCompare(b.name);
      }

      if (input === 'price') {
        if (order === 'desc') {
          return b.price - a.price;
        }

        return a.price - b.price;
      }

      return 0;
    });

    return await Promise.resolve(sortedProducts);
  }
}
