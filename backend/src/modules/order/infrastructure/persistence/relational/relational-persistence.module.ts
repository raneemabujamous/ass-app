import { Module } from '@nestjs/common';
import { OrderRepository } from '../order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import {OrdersRelationalRepository} from './repositories/order.repository'
@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity , OrderItemEntity])],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrdersRelationalRepository,
    },
  ],
  exports: [OrderRepository],
})
export class RelationalOrderPersistenceModule {}
