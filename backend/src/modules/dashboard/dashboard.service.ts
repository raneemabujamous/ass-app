// src/modules/dashboard/application/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DimDateEntity } from './infrastructure/persistence/relational/entities/dim-date.entity';
import { DimCustomerEntity } from './infrastructure/persistence/relational/entities/dim-customer.entity';
import { DimProductEntity } from './infrastructure/persistence/relational/entities/dim-product.entity';
import { FactSalesEntity } from './infrastructure/persistence/relational/entities/fact-sales.entity';

type OptionalDate = Date | undefined;

function toDateKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function parseMaybeDate(s?: string): OptionalDate {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(FactSalesEntity) private readonly factRepo: Repository<FactSalesEntity>,
    @InjectRepository(DimDateEntity) private readonly dateRepo: Repository<DimDateEntity>,
    @InjectRepository(DimProductEntity) private readonly prodRepo: Repository<DimProductEntity>,
    @InjectRepository(DimCustomerEntity) private readonly custRepo: Repository<DimCustomerEntity>,
  ) {}

  // --------- KPI ---------
  async getKpis(startDate?: string, endDate?: string) {
    const s = parseMaybeDate(startDate);
    const e = parseMaybeDate(endDate);

    const qb = this.factRepo.createQueryBuilder('fs')
      .select('COALESCE(SUM(fs.line_total), 0)', 'total_revenue')
      .addSelect('COUNT(DISTINCT fs.order_id)', 'total_orders');

    if (s && e) qb.where('fs.date_key BETWEEN :s AND :e', { s: toDateKey(s), e: toDateKey(e) });
    else if (s) qb.where('fs.date_key >= :s', { s: toDateKey(s) });
    else if (e) qb.where('fs.date_key <= :e', { e: toDateKey(e) });

    const raw = await qb.getRawOne<{ total_revenue: string; total_orders: string }>();
    const totalRevenue = Number(raw?.total_revenue ?? 0);
    const totalOrders = Number(raw?.total_orders ?? 0);
    const aov = totalOrders ? +(totalRevenue / totalOrders).toFixed(2) : 0;

    return { total_revenue: totalRevenue, total_orders: totalOrders, average_order_value: aov };
  }

  // --------- Revenue over time ---------
  async revenueOverTime(granularity: 'daily' | 'monthly', startDate?: string, endDate?: string) {
    const s = parseMaybeDate(startDate);
    const e = parseMaybeDate(endDate);

    const qb = this.factRepo.createQueryBuilder('fs')
      .innerJoin(DimDateEntity, 'dd', 'dd.date_key = fs.date_key');

    if (granularity === 'daily') {
      qb.select(['dd.year AS year', 'dd.month AS month', 'dd.day AS day'])
        .addSelect('COALESCE(SUM(fs.line_total), 0)', 'rev')
        .groupBy('dd.year, dd.month, dd.day')
        .orderBy('dd.year', 'ASC').addOrderBy('dd.month', 'ASC').addOrderBy('dd.day', 'ASC');
    } else {
      qb.select(['dd.year AS year', 'dd.month AS month'])
        .addSelect('COALESCE(SUM(fs.line_total), 0)', 'rev')
        .groupBy('dd.year, dd.month')
        .orderBy('dd.year', 'ASC').addOrderBy('dd.month', 'ASC');
    }

    if (s && e) qb.where('fs.date_key BETWEEN :s AND :e', { s: toDateKey(s), e: toDateKey(e) });
    else if (s) qb.where('fs.date_key >= :s', { s: toDateKey(s) });
    else if (e) qb.where('fs.date_key <= :e', { e: toDateKey(e) });

    const rows = await qb.getRawMany<any>();
    const series = rows.map(r =>
      granularity === 'daily'
        ? { period: `${r.year}-${String(r.month).padStart(2,'0')}-${String(r.day).padStart(2,'0')}`, revenue: Number(r.rev) }
        : { period: `${r.year}-${String(r.month).padStart(2,'0')}`, revenue: Number(r.rev) }
    );

    return { granularity, series };
  }

  // --------- Top products ---------
  async topProducts(limit = 10, startDate?: string, endDate?: string) {
    const s = parseMaybeDate(startDate);
    const e = parseMaybeDate(endDate);

    const qb = this.factRepo.createQueryBuilder('fs')
      .innerJoin(DimProductEntity, 'dp', 'dp.product_id = fs.product_id')
      .select(['dp.product_id AS id', 'dp.name AS name'])
      .addSelect('COALESCE(SUM(fs.line_total), 0)', 'value')
      .addSelect('SUM(fs.quantity)', 'count')
      .groupBy('dp.product_id, dp.name')
      .orderBy('value', 'DESC')
      .limit(limit);

    if (s && e) qb.where('fs.date_key BETWEEN :s AND :e', { s: toDateKey(s), e: toDateKey(e) });
    else if (s) qb.where('fs.date_key >= :s', { s: toDateKey(s) });
    else if (e) qb.where('fs.date_key <= :e', { e: toDateKey(e) });

    const rows = await qb.getRawMany<any>();
    return { rows: rows.map(r => ({ id: Number(r.id), name: r.name, value: Number(r.value), count: Number(r.count ?? 0) })) };
  }

  async top2Products(startDate?: string, endDate?: string) {
    return this.topProducts(2, startDate, endDate);
  }

  // --------- Orders by customer ---------
  async ordersByCustomer(limit = 15, startDate?: string, endDate?: string) {
    const s = parseMaybeDate(startDate);
    const e = parseMaybeDate(endDate);

    const qb = this.factRepo.createQueryBuilder('fs')
      .innerJoin(DimCustomerEntity, 'dc', 'dc.customer_id = fs.customer_id')
      .select(['dc.customer_id AS customer_id', 'dc.name AS name'])
      .addSelect('COUNT(DISTINCT fs.order_id)', 'orders')
      .groupBy('dc.customer_id, dc.name')
      .orderBy('orders', 'DESC')
      .limit(limit);

    if (s && e) qb.where('fs.date_key BETWEEN :s AND :e', { s: toDateKey(s), e: toDateKey(e) });
    else if (s) qb.where('fs.date_key >= :s', { s: toDateKey(s) });
    else if (e) qb.where('fs.date_key <= :e', { e: toDateKey(e) });

    const rows = await qb.getRawMany<any>();
    return { rows: rows.map(r => ({ customer_id: Number(r.customer_id), customer_name: r.name, orders: Number(r.orders) })) };
  }

  // --------- Summary ---------
  async summary(params: {
    granularity?: 'daily' | 'monthly',
    top_n_products?: number,
    customers_bar_limit?: number,
    startDate?: string,
    endDate?: string,
  }) {
    const granularity = params.granularity ?? 'daily';
    const topN = params.top_n_products ?? 10;
    const custLim = params.customers_bar_limit ?? 15;

    const [kpis, rot, tops, bycust, top2] = await Promise.all([
      this.getKpis(params.startDate, params.endDate),
      this.revenueOverTime(granularity, params.startDate, params.endDate),
      this.topProducts(topN, params.startDate, params.endDate),
      this.ordersByCustomer(custLim, params.startDate, params.endDate),
      this.top2Products(params.startDate, params.endDate),
    ]);

    return {
      kpis,
      revenue_over_time: rot,
      top_products: tops,
      orders_by_customer: bycust,
      top_2_products: top2,
    };
  }
}
