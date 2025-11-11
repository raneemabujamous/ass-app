import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './order.service';
import { CreateOrderDto } from '@/packages/dto/order';


@ApiTags('orders')
@Controller('orders')
export class OrdersController {
constructor(private readonly orderService: OrdersService) {}


}