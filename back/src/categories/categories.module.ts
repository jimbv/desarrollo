import { Global, Module } from '@nestjs/common';
import { InMemoryCategoriesRepository } from './repositories/in-memory-categories.repository';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';

@Global()
@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CATEGORIES_REPOSITORY, useClass: InMemoryCategoriesRepository },
  ],
  exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
