import { DeepPartial } from '../../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../utils/types/nullable.type';
import { Order, } from '../../../../packages/domins';
import { OrderItem } from '@/packages/domins/order';

export abstract class OrderRepository {

  abstract createOrder(
    data: Omit<Order, 'project_id' | 'createdAt' | 'deletedAt' | 'updatedAt'>
  ): Promise<Order>;



  
  abstract getOrderById(
    id: number 
  ): Promise<Order>;

  
   
  abstract getOrderItemById(
    id: number 
  ): Promise<OrderItem>;

  

  abstract update(
    payload: Partial<
      Omit<
      Order,
        'project_id' | 'createdAt' | 'updatedAt' | 'deletedAt'
      >
    >
  ): Promise<Order | null>;


  abstract delete(id?: Order['id']): Promise<void>;



  
}
