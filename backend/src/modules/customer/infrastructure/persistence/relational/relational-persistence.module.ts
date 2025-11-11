import { Module } from '@nestjs/common';
import { CustomerRepository } from '../customer.repository';
import { CustomersRelationalRepository } from './repositories/customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [
    {
      provide: CustomerRepository,
      useClass: CustomersRelationalRepository,
    },
  ],
  exports: [CustomerRepository],
})
export class RelationalCustomerPersistenceModule {}
