import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Product } from '../../../../../../packages/domins';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { ProductVariantEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product-variant.entity';

@Entity({ name: 'products' })
@Unique(['sku'])
export class ProductEntity extends EntityRelationalHelper implements Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  sku: string;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  price: number;

  @OneToMany(() => ProductVariantEntity, (v) => v.product, {
    cascade: true,
  })
  variants: ProductVariantEntity[];
}
