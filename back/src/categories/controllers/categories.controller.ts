import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.update(Number(id), body);
  }

  @Delete(':id')
    remove(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.remove(Number(id));
    }
}