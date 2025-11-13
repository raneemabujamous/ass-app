import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './order.service';
import { CreateOrderDto } from '@/packages/dto/order';

import { UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
constructor(private readonly orderService: OrdersService) {}

@Post()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
async create(@Body() createOrderDto: CreateOrderDto): Promise<any> {
  return this.orderService.createOrder(createOrderDto);
}
}