import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { OrderItem, ProductVariant } from '../../../../../../packages/domins';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { ProductEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product.entity';
import { OrderItemEntity } from '@/modules/order/infrastructure/persistence/relational/entities/order-item.entity';

@Entity({ name: 'product_variants' })
@Unique(['product', 'size', 'color'])
export class ProductVariantEntity
  extends EntityRelationalHelper
  implements ProductVariant
{
  @PrimaryGeneratedColumn()
  product_variant_id: number;

  @Column()
  product_id:number


  @Column({ length: 64, default: '' ,nullable:true})
  size: string;

  @Column({ length: 64, default: '' ,nullable:true})
  color: string; 


  @OneToMany(() => OrderItemEntity, (oi) => oi.variant, {
    cascade: true,
  })
  order_item: OrderItemEntity[];


  @ManyToOne(() => ProductEntity, (p) => p.variants, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;


}
