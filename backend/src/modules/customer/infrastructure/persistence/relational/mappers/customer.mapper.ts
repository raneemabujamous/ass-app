import { Customer } from '@/packages/domins';
import { CustomerEntity } from '../entities/customer.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): Customer {
    const customer = new Customer();
    customer.id = entity.id;
    customer.name = entity.name;
    customer.email = entity.email;
    return customer;
  }

  static toPersistence(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = customer.id;
    entity.name = customer.name;
    entity.email = customer.email;
    
    return entity;
  }
}
