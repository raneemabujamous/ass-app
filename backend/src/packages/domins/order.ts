import { Expose, Type } from 'class-transformer';
import { Product  ,ProductVariant} from './products';
import { Customer } from './customer';

export class OrderItem {

  id: number;

  order_id: number;

  quantity: number;


  unit_price: string | null;    

  product_variant_id:number
}
export class Order {

  id: number;


  customer_id:number

  order_datetime: Date;


  currency: string; 
  total: string; 

}
