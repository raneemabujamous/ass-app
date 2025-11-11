import { Module } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { ProductRelationalRepository } from './repositories/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductVariantEntity } from './entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity , ProductEntity])],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductRelationalRepository,
    },
  ],
  exports: [ProductRepository],
})
export class RelationalProjectPersistenceModule {}
