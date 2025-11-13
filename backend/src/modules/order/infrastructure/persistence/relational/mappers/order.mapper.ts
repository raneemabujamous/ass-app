import { OrderItem,  Order } from '@/packages/domins';
import { OrderItemEntity } from '../entities/order-item.entity';
import {
   OrderEntity
}from '../entities/order.entity';
export class OrderItemMapper {
  static toDomain(entity: OrderItemEntity): OrderItem {
    const  orderItem = new OrderItem();
    orderItem.id = entity.id;
    orderItem.product_variant_id = entity.product_variant_id;

    orderItem.order_id = entity.order_id;
     orderItem.quantity = entity.quantity;
     orderItem.quantity = entity.quantity;    
     orderItem.unit_price = entity.unit_price;

    return  orderItem;
  }

  static toPersistence( orderItem: OrderItem): OrderItemEntity {
    const entity = new OrderItemEntity();
    entity.id = orderItem.id;
    entity.product_variant_id = orderItem.product_variant_id;

    entity.order_id =  orderItem.order_id;
    entity.unit_price =  orderItem.unit_price;
    entity.quantity =  orderItem.quantity;

    return entity;
  }
}


export class OrderMapper {
  static toDomain(entity:  OrderEntity):  Order {
    const  order = new  Order();
     order.id = entity.id;
     order.customer_id = entity.customer_id;

     order.order_datetime = entity.order_datetime;
     order.currency = entity.currency;
     order.total = entity.total;

    return  order;
  }

  static toPersistence( order:  Order):  OrderEntity {
    const entity = new  OrderEntity();
    entity.order_datetime =  order.order_datetime;
    entity.id =  order.id;
    entity.customer_id = order.customer_id;

    entity.currency =  order.currency;
    entity.total =  order.total;

    return entity;
  }
}