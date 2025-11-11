import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { ProductVariant } from '../../../../../../packages/domins';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { ProductEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product.entity';

@Entity({ name: 'product_variants' })
@Unique(['product', 'size', 'color'])
export class ProductVariantEntity
  extends EntityRelationalHelper
  implements ProductVariant
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id:number

  @ManyToOne(() => ProductEntity, (p) => p.variants, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ length: 64, default: '' })
  size: string; // e.g., S, M, L, 42

  @Column({ length: 64, default: '' })
  color: string; // normalized uppercase

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  unitPrice: string;

  @Column({ length: 8, default: 'USD' })
  currency: string;
}
