import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from './infrastructure/persistence/relational/entities/product-variant.entity';
import { ProductEntity } from './infrastructure/persistence/relational/entities/product.entity';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import {RelationalProjectPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalProjectPersistenceModule;


@Module({
imports: [infrastructurePersistenceModule],
controllers: [ProductsController],
providers: [ProductsService],
exports: [ProductsService,infrastructurePersistenceModule],
})
export class ProductsModule {}