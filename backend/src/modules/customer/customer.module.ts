import { Module } from '@nestjs/common';

import { CustomersController } from './customer.controller';

import { CustomersService } from './customer.service';
import { RelationalCustomerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
const infrastructurePersistenceModule = RelationalCustomerPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule,  // <- VERY IMPORTANT!
],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService, infrastructurePersistenceModule],
})
export class CustomerModule {}
