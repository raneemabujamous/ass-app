import { Product, ProductVariant } from '@/packages/domins';
import { ProductEntity } from '../entities/product.entity';
import {
  ProductVariantEntity
}from '../entities/product-variant.entity';
export class ProductMapper {
  // ---- Entity -> Domain
  static toDomain(entity: ProductEntity): Product {
    const product = new Product();
    product.id = entity.id;
    product.name = entity.name;
    product.sku = entity.sku;

    const variants = (entity.variants ?? []).map((ve) => ({
      id: ve.id,
      size: ve.size,
      color: ve.color,
      unitPrice: ve.unitPrice, // keep string to match decimal column
      currency: ve.currency,
    }));

    // assuming your Product domain has a `variants` field
    (product as any).variants = variants;

    return product;
  }

  // Optional: a response-shaped POJO if you don’t want to expose domain objects directly
  static toResponse(entity: ProductEntity) {
    return {
      id: entity.id,
      name: entity.name,
      sku: entity.sku,
      variants: (entity.variants ?? []).map((ve) => ({
        id: ve.id,
        size: ve.size,
        color: ve.color,
        unitPrice: ve.unitPrice,
        currency: ve.currency,
      })),
    };
  }

  // ---- Domain -> Entity
  static toPersistence(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id as any;
    entity.name = product.name;
    entity.sku = product.sku;

    const domainVariants: Array<{
      id?: number;
      size: string;
      color: string;
      unitPrice: string;
      currency: string;
    }> = (product as any).variants ?? [];

    entity.variants = domainVariants.map((v) => {
      const ve = new ProductVariantEntity();
      ve.id = v.id as any;
      ve.size = v.size ?? '';
      ve.color = v.color ?? '';
      ve.unitPrice = v.unitPrice ?? '0';
      ve.currency = v.currency ?? 'USD';
      // NOTE: don’t set ve.product here unless you need back-reference for save;
      // TypeORM will set product_id when saving through ProductEntity (cascade).
      return ve;
    });

    return entity;
  }
}



export class ProductVariantMapper {
  static toDomain(entity: ProductVariantEntity): ProductVariant {
    const product = new ProductVariant();
    product.id = entity.id;
    product.product_id = entity.product_id;

    product.color = entity.color;
    product.currency = entity.currency;
    product.size = entity.size;
    product.unitPrice = entity.unitPrice;

    return product;
  }

  static toPersistence(product: ProductVariant): ProductVariantEntity {
    const entity = new ProductVariantEntity();
    entity.id = product.id;
    entity.product_id = product.product_id;
    entity.color = product.color;
    entity.currency = product.currency;
    entity.size = product.size;
    entity.unitPrice = product.unitPrice;

    return entity;
  }
}