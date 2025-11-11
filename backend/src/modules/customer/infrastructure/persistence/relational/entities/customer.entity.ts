import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Customer } from '../../../../../../packages/domins';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { OrderEntity } from '@/modules/order/infrastructure/persistence/relational/entities/order.entity';

@Entity({ name: 'customers' })
@Unique(['email'])
export class CustomerEntity extends EntityRelationalHelper implements Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  email: string ;

  @OneToMany(() => OrderEntity, (order) => order.customer, {
    onDelete: 'CASCADE',
  })
  orders: OrderEntity[];
}
