import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationalOrderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
const infrastructurePersistenceModule = RelationalOrderPersistenceModule;
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { ProductsModule } from '../product/product.module';
import { CustomersService } from '../customer/customer.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
imports: [infrastructurePersistenceModule,ProductsModule , CustomerModule],
controllers: [OrdersController],
providers: [OrdersService , ProductsModule , CustomerModule],
exports: [OrdersModule, infrastructurePersistenceModule],

})
export class OrdersModule {}