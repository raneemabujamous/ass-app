import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Order , OrderItem } from '../../../../../../packages/domins';
import { OrderRepository } from '../../order.repository';
import { OrderMapper, OrderItemMapper} from '../mappers/order.mapper';
import { EntityCondition } from '../../../../../../utils/types/entity-condition.type';
import{OrderEntity} from '../entities/order.entity'
import { OrderItemEntity } from '../entities/order-item.entity';
@Injectable()
export class OrdersRelationalRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,

  ) {}

  async createOrder(data: Order): Promise<Order> {

    console.log("data::",data)
    const persistenceModel = OrderMapper.toPersistence(data); // OrderEntity
    const newEntity = await this.orderRepository.save(
      this.orderRepository.create(persistenceModel)
    );
    return OrderMapper.toDomain(newEntity); // returns Order
  
  }

  async createOrderItem(data: OrderItem): Promise<OrderItem> {

    console.log("data::",data)
    const persistenceModel = OrderItemMapper.toPersistence(data); // OrderEntity
    const newEntity = await this.orderItemRepo.save(
      this.orderItemRepo.create(persistenceModel)
    );
    return OrderItemMapper.toDomain(newEntity); // returns Order
  
  }



  async getOrderById(id: number): Promise<Order> {
    const entity = await this.orderRepository.findOneBy({ id: id });
    if (!entity) throw new Error('Order not found');
    return entity
  } 


  async getOrderItemById(orderId: number): Promise<OrderItem> {
    const entity = await this.orderItemRepo.findOneBy({ order_id: orderId });
    if (!entity) throw new Error('Order not found');
    return entity
  } 


  async update(
    payload: Partial<
      Omit<Order, 'createdAt' | 'updatedAt' | 'deletedAt'>
    >
  ): Promise<Order | null> {
    console.log("payload:::",payload)
    const entity = await this.orderRepository.findOne({
      where: { id: Number(payload.id) },
    });
    if (!entity) {
      throw new Error('Session not found');
    }

    const updatedEntity = await this.orderRepository.save(
      this.orderRepository.create(
        OrderMapper.toPersistence({
          ...OrderMapper.toDomain(entity),
          ...payload,
        })
      )
    );

    return OrderMapper.toDomain(updatedEntity);

  }
  async delete(order_id: Order['id']): Promise<void> {
    await this.orderRepository
      .createQueryBuilder()
      .delete()
      .from(OrderEntity)
      .where('order_id = :order_id', { order_id })
      .execute();
  }





}