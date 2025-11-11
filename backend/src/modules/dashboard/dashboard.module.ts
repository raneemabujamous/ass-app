// src/modules/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DimDateEntity } from './infrastructure/persistence/relational/entities/dim-date.entity';
import { DimCustomerEntity } from './infrastructure/persistence/relational/entities/dim-customer.entity';
import { DimProductEntity } from './infrastructure/persistence/relational/entities/dim-product.entity';
import { FactSalesEntity } from './infrastructure/persistence/relational/entities/fact-sales.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DimDateEntity,DimCustomerEntity,DimProductEntity,FactSalesEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
