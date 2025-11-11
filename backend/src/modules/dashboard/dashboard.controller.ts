// src/modules/dashboard/interfaces/http/dashboard.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { RevenueOverTimeQuery } from '@/packages/dto/dashboard/revenue-over-time.dto';
import { TopProductsQuery } from '@/packages/dto/dashboard/top-products.dto';
import { OrdersByCustomerQuery } from '@/packages/dto/dashboard/orders-by-customer.dto';
import { KpisQuery } from '@/packages/dto/dashboard/kpis.dto';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('kpis')
  @ApiOkResponse({ description: 'KPIs: total revenue, total orders, average order value' })
  async kpis(@Query() q: KpisQuery) {
    return this.svc.getKpis(q.startDate, q.endDate);
  }

  @Get('revenue-over-time')
  @ApiOkResponse({ description: 'Revenue over time (daily/monthly)' })
  async revenueOverTime(@Query() q: RevenueOverTimeQuery) {
    return this.svc.revenueOverTime(q.granularity, q.startDate, q.endDate);
  }

  @Get('top-products')
  @ApiOkResponse({ description: 'Top products by revenue' })
  async topProducts(@Query() q: TopProductsQuery) {
    return this.svc.topProducts(q.limit, q.startDate, q.endDate);
  }

  @Get('top-2-products')
  @ApiOkResponse({ description: 'Top 2 products by revenue' })
  async top2Products(@Query() q: KpisQuery) {
    return this.svc.top2Products(q.startDate, q.endDate);
  }

  @Get('orders-by-customer')
  @ApiOkResponse({ description: 'How many orders per customer' })
  async ordersByCustomer(@Query() q: OrdersByCustomerQuery) {
    return this.svc.ordersByCustomer(q.limit, q.startDate, q.endDate);
  }

  @Get('summary')
  @ApiOkResponse({ description: 'All widgets in a single payload' })
  async summary(
    @Query('granularity') granularity: 'daily' | 'monthly' = 'daily',
    @Query('top_n_products') topN = 10,
    @Query('customers_bar_limit') custLim = 15,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.svc.summary({ granularity, top_n_products: +topN, customers_bar_limit: +custLim, startDate, endDate });
  }
}
