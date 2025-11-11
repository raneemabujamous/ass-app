import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../../../../../packages/domins';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { CustomerEntity } from '@/modules/customer/infrastructure/persistence/relational/entities/customer.entity';
import { OrderItemEntity } from '@/modules/order/infrastructure/persistence/relational/entities/order-item.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends EntityRelationalHelper implements Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerEntity, (c) => c.orders, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @CreateDateColumn({ type: 'timestamptz', name: 'order_datetime' })
  orderDatetime: Date;

  @Column({ length: 8, default: 'USD' })
  currency: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subtotal: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total: string;

  @OneToMany(() => OrderItemEntity, (i) => i.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemEntity[];
}
