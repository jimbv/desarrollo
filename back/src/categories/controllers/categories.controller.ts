import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Category, CreateCategoryInput } from '../category.types';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Category[] {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Category {
    return this.categoriesService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreateCategoryInput): Category {
    return this.categoriesService.create(body);
  }

  @Delete(':id')
    remove(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.remove(Number(id));
    }
}