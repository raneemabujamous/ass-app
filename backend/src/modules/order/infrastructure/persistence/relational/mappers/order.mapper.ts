import { OrderItem,  Order } from '@/packages/domins';
import { OrderItemEntity } from '../entities/order-item.entity';
import {
   OrderEntity
}from '../entities/order.entity';
export class OrderItemMapper {
  static toDomain(entity: OrderItemEntity): OrderItem {
    const  order = new OrderItem();
     order.id = entity.id;
    
     order.order_id = entity.order_id;
     order.unitPrice = entity.unitPrice;
     order.quantity = entity.quantity;    
     order.discount = entity.discount;
     order.taxRate = entity.taxRate;
     order.lineSubtotal = entity.lineSubtotal;
     order.lineTotal = entity.lineTotal;

    return  order;
  }

  static toPersistence( order: OrderItem): OrderItemEntity {
    const entity = new OrderItemEntity();
    entity.order_id =  order.order_id;
    entity.unitPrice =  order.unitPrice;
    entity.quantity =  order.quantity;
    entity.discount =  order.discount;
    entity.taxRate =  order.taxRate;
    entity.lineSubtotal =  order.lineSubtotal;
    entity.lineTotal =  order.lineTotal;

    return entity;
  }
}


export class OrderMapper {
  static toDomain(entity:  OrderEntity):  Order {
    const  order = new  Order();
     order.id = entity.id;
     order.orderDatetime = entity.orderDatetime;
     order.currency = entity.currency;
     order.subtotal = entity.subtotal;
     order.taxAmount = entity.taxAmount;
     order.total = entity.total;

    return  order;
  }

  static toPersistence( order:  Order):  OrderEntity {
    const entity = new  OrderEntity();
    entity.orderDatetime =  order.orderDatetime;
    entity.id =  order.id;
    entity.currency =  order.currency;
    entity.subtotal =  order.subtotal;
    entity.taxAmount =  order.taxAmount;
    entity.total =  order.total;

    return entity;
  }
}