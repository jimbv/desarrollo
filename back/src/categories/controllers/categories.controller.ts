import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import type { Category, CreateCategoryInput } from '../categories.types';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Get()
  findAll(): Category[] {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Category | undefined {
    return this.categoriesService.findById(Number(id));
  }

  @Post()
  create(@Body() input: CreateCategoryInput): Category {
    return this.categoriesService.create(input);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Category {
    return this.categoriesService.remove(Number(id));
  }
}
