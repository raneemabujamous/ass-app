import { Expose, Type } from 'class-transformer';
import { Product  ,ProductVariant} from './products';
import { Customer } from './customer';

export class OrderItem {

  id: number;


  order_id: number;


  quantity: number;


  unitPrice: string | null;     // decimal(12,2)


  discount: string;      // decimal(12,2)


  taxRate: string;       // decimal(12,4) e.g., "0.1000"


  lineSubtotal: string;  // decimal(12,2)


  taxAmount: string;     // decimal(12,2)


  lineTotal: string;     // decimal(12,2)
}
export class Order {

  id: number;




  orderDatetime: Date;


  currency: string; // e.g., "USD"

  subtotal: string; // decimal(12,2)

  taxAmount: string; // decimal(12,2)

  total: string; // decimal(12,2)

}
