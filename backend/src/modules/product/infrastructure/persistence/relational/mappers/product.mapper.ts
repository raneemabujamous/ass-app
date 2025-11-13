import { Product, ProductVariant } from '@/packages/domins';
import { ProductEntity } from '../entities/product.entity';
import {
  ProductVariantEntity
}from '../entities/product-variant.entity';
export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const product = new Product();
    product.id = entity.id;
    product.name = entity.name;
    product.sku = entity.sku;
    product.price = entity.price;

    const variants = (entity.variants ?? []).map((ve) => ({
      product_variant_id: ve.product_variant_id,
      product_id : entity.id,
      size: ve.size,
      color: ve.color,
    }));

    (product as any).variants = variants;

    return product;
  }

  static toResponse(entity: ProductEntity) {
    return {
      id: entity.id,
      name: entity.name,
      sku: entity.sku,
    price : entity.price,

      variants: (entity.variants ?? []).map((ve) => ({
        product_variant_id: ve.product_variant_id,
        size: ve.size,
        color: ve.color,
      })),
    };
  }

  // ---- Domain -> Entity
  static toPersistence(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id as any;
    entity.name = product.name;
    entity.sku = product.sku;
    entity.price = product.price;

    const domainVariants: Array<{
      id?: number;
      size: string;
      color: string;
      product_id: number;
    }> = (product as any).variants ?? [];

    entity.variants = domainVariants.map((v) => {
      const ve = new ProductVariantEntity();
      ve.product_variant_id = v.id as any;
      ve.size = v.size ?? '';
      ve.product_id = entity.id,
      ve.color = v.color ?? '';
      return ve;
    });

    return entity;
  }
}



export class ProductVariantMapper {
  static toDomain(entity: ProductVariantEntity): ProductVariant {
    const product = new ProductVariant();
    product.product_variant_id = entity.product_variant_id;
    product.product_id = entity.product_id;

    product.color = entity.color;
    product.size = entity.size;

    return product;
  }

  static toPersistence(product: ProductVariant): ProductVariantEntity {
    const entity = new ProductVariantEntity();
    entity.product_variant_id = product.product_variant_id;
    entity.product_id = product.product_id;
    entity.color = product.color;
    entity.size = product.size;

    return entity;
  }
}