import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Product } from '@/packages/domins';
import { CreateProductDto } from '@/packages/dto/order/create-product.dto';
import { ProductEntity } from './relational/entities/product.entity';
import { ProductVariantEntity } from './relational/entities/product-variant.entity';

export abstract class ProductRepository {
  // Transactions
  abstract transaction<T>(work: (em: EntityManager) => Promise<T>): Promise<T>;

  abstract productQb(alias?: string): SelectQueryBuilder<ProductEntity>;

  abstract createProduct(dto: CreateProductDto): Promise<any>;
  abstract findById(id: number): Promise<Product | null>;
  abstract findEntityById(id: number): Promise<ProductEntity | null>; // convenience for relations
  abstract findBySku(sku: string): Promise<Product | null>;
  abstract addVariant(
    productId: number,
    payload: { size: string; color: string; unitPrice: string; currency: string }
  ): Promise<{
    id: number;
    productId: number;
    size: string;
    color: string;
    unitPrice: string;
    currency: string;
  }>;
}
