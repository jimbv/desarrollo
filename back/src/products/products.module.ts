import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsController } from './controllers/products.controller';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { TypeOrmProductsRepository } from 'src/products/repositories/typeorm-products.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}
