import { CreateProductInput, Product, UpdateProductInput, } from '../product.types';
import { PaginatedResult } from 'src/common/types/paginated-result.type';

export class InMemoryProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  findAll(name?: string,
    orderBy?: 'id' | 'price' | 'name' | 'stock',
    order?: 'asc' | 'desc',
    page = 1,
    limit = 10,): PaginatedResult<Product> {
    let result = [...this.products];

    if (name && String(name).trim() !== '' && String(name) !== 'undefined' && String(name) !== 'null') {
      const searchName = String(name).toLowerCase();
      result = result.filter((product) => 
        product && product.name && String(product.name).toLowerCase().includes(searchName)
      );
    }

    if (orderBy) {
      result.sort((a, b) => {
        if (orderBy === 'name') {
          return order === 'desc'
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        }

        return order === 'desc'
          ? b[orderBy] - a[orderBy]
          : a[orderBy] - b[orderBy];
      });
    }

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 50 ? 50 : limit;
    const total = result.length;
    const totalPages = Math.ceil(total / safeLimit);
    const start = (safePage - 1) * safeLimit;
    const data = result.slice(start, start + safeLimit);

    return {
      items: data,
      total,
      page: safePage,
      limit: safeLimit,
    }
  }

  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
  
  findByCategoryId(categoryId: number): Product[] {
    return this.products.filter((product) => product.categoryId === categoryId);
  }

  create(input: CreateProductInput): Product {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock,
      categoryId: input.categoryId,
    };

    this.products.push(product);
    return product;
  }

  update(id: number, input: UpdateProductInput): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;
    if (input.categoryId !== undefined) product.categoryId = input.categoryId;
    return product;
  }

  updateStock(id: number, quantity: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    product.stock -= quantity;
    return product;
  }

  remove(id: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }
}