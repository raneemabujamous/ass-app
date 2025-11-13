import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/modules/order/infrastructure/persistence/relational/entities/order.entity';
import { OrderItemEntity } from '@/modules/order/infrastructure/persistence/relational/entities/order-item.entity';
import { CustomerEntity } from '@/modules/customer/infrastructure/persistence/relational/entities/customer.entity';
import { ProductEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product.entity';
import { ProductVariantEntity } from '@/modules/product/infrastructure/persistence/relational/entities/product-variant.entity';
import { CreateOrderDto } from '@/packages/dto/order/create-order.dto';
import Decimal from 'decimal.js';
import { q2, q4, d } from '@/utils/helper';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { CustomersService } from '../customer/customer.service';
import { ProductsService } from '../product/product.service';
import { Product
  , ProductVariant
} from '@/packages/domins/products'

import { Customer
} from '@/packages/domins/customer'
import { Order } from '@/packages/domins';

@Injectable()
export class OrdersService {
constructor(
private readonly orderRepository: OrderRepository,
private readonly customerService: CustomersService,
private readonly productService: ProductsService

) {}




  async createOrder(dto: CreateOrderDto): Promise<any> {
    const customer = await this.customerService.findOne(
    Number(dto.customerId) ,
    );
    if (!customer) throw new Error('Customer not found');
    let order =await  this.orderRepository.createOrder({
      customer_id: customer.id,
      currency: dto.currency || 'USD',
      total: '0',
      order_datetime: new Date(),
    });
  
    let subtotal = 0;
  
    // 3️⃣ Add items one by one
    for (const itemDto of dto.items) {
      const product = await this.productService.findById(itemDto.productId);
      if (!product) throw new Error(`Product ${itemDto.productId} not found`);
  
      let variant = null;
      // if (itemDto.variantId) {
        variant = await this.productService.findVerId( itemDto.variantId );
      // }
  console.log("product::",product)
      const unitPrice = Number( product?.price || 0); // fallback to product.price
    console.log("variant",variant)
      const orderItem = await this.orderRepository.createOrderItem({
        order_id: order.id,
        product_variant_id: Number(itemDto.variantId),
        unit_price: unitPrice.toFixed(2),
        quantity: itemDto.quantity
      });
  
      subtotal += unitPrice;
    }
    order.total = subtotal.toFixed(2);
  
    await this.orderRepository.update({id :order.id, total: order.total }); // update DB

    return 'sucess create order'
  }
  
  
 
}  