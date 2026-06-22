import { forwardRef, Global, Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { InMemoryCategoriesRepository } from './repositories/in-memory-categories.repository';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { CategoriesService } from './services/categories.service';
import { ProductsModule } from 'src/products/products.module';

@Global()
@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: InMemoryCategoriesRepository,
    },
  ],
  imports: [forwardRef(() => ProductsModule)],
  exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}