import { forwardRef, Global, Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { TypeOrmProductsRepository } from './repositories/typeorm-products.repository';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { CategoriesModule } from 'src/categories/categories.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}