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

@Injectable()
export class OrdersService {
constructor(
private readonly orderRepository: OrderRepository,
private readonly customerService: CustomersService,
private readonly productService: ProductsService

) {}



}