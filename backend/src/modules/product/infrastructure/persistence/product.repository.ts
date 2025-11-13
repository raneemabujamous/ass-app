import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Product, ProductVariant } from '@/packages/domins';
import { CreateProductDto } from '@/packages/dto/order/create-product.dto';
import { ProductEntity } from './relational/entities/product.entity';
import { ProductVariantEntity } from './relational/entities/product-variant.entity';

export abstract class ProductRepository {
  // Transactions
  abstract transaction<T>(work: (em: EntityManager) => Promise<T>): Promise<T>;

  abstract productQb(alias?: string): SelectQueryBuilder<ProductEntity>;
  
  abstract findVerId(id: number): Promise<ProductVariant | null>;

  abstract getAllProduct(): Promise<any>;
  abstract createProduct(dto: CreateProductDto): Promise<any>;
  abstract findById(id: number): Promise<Product | null>;
  abstract findEntityById(id: number): Promise<ProductEntity | null>; // convenience for relations
  abstract findBySku(sku: string): Promise<Product | null>;
  abstract addVariant(
    productId: number,
    payload: { size: string; color: string; }
  ): Promise<{
    product_variant_id: number;
    product_id: number;
    size: string;
    color: string;
  }>;
}
