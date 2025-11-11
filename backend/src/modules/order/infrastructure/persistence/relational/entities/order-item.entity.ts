import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
  } from 'typeorm';
  import { OrderItem } from '../../../../../../packages/domins';
  import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
  import { OrderEntity } from '@/modules/order/infrastructure/persistence/relational/entities/order.entity';
  import { ProductEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product.entity';
  import { ProductVariantEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product-variant.entity';
  
  @Entity({ name: 'order_items' })
  export class OrderItemEntity
    extends EntityRelationalHelper
    implements OrderItem
  {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    order_id:number 

    @ManyToOne(() => OrderEntity, (o) => o.items, {
      onDelete: 'CASCADE',
      eager: false,
    })
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;
  
    @ManyToOne(() => ProductEntity, {
      eager: true,
      onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;
  
    @ManyToOne(() => ProductVariantEntity, {
      eager: true,
      nullable: true,
      onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariantEntity | null;
  
    @Column('int')
    quantity: number;
  
    @Column({ name: 'unitPrice', type: 'numeric', precision: 12, scale: 2, nullable: true })
    unitPrice: string | null;
      
    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    discount: string;
  
    @Column('decimal', { precision: 12, scale: 4, default: 0.1 })
    taxRate: string; // 0.1000 = 10%
  
    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    lineSubtotal: string;
  
    @Column('decimal', { precision: 12, scale: 2 , nullable: true})
    taxAmount: string;
  
    @Column('decimal', { precision: 12, scale: 2 ,nullable: true})
    lineTotal: string;
  }
  