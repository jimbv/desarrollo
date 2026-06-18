import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import type { Product } from '../product.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @Get('search/:name')
  async findByName(
    @Param('name') name: string,
  ): Promise<Product[] | undefined> {
    return await this.productsService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(Number(id), updateProductDto);
  }

  @Patch(':id/stock')
  async reduceStock(
    @Param('id') id: string,
    @Body('stock') stock: number,
  ): Promise<Product | undefined> {
    return await this.productsService.reduceStock(Number(id), stock);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product | undefined> {
    return await this.productsService.remove(Number(id));
  }

  @Get('orderBy/:input/')
  async orderBy(
    @Param('input') input: 'name' | 'price',
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<Product[]> {
    return await this.productsService.orderBy(input, order);
  }
}
