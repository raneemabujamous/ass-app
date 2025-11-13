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

   @Column()
   product_variant_id :number

    @Column('int')
    quantity: number;
  
    @Column({ name: 'total', type: 'numeric', precision: 12, scale: 2, nullable: true })
    unit_price: string | null;


  
    @ManyToOne(
      () => ProductVariantEntity,
      (pv) => pv.order_item,
      {
        onDelete: 'CASCADE',
      }
    )
    @JoinColumn({
      name: 'product_variant_id',
      referencedColumnName: 'product_variant_id',
    })
    variant: ProductVariantEntity;


    @ManyToOne(
      () => OrderEntity,
      (o) => o.items,
      {
        onDelete: 'CASCADE',
      }
    )
    @JoinColumn({
      name: 'order_id',
      referencedColumnName: 'id',
    })
    order: OrderEntity;
    
  }
  