import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Customer,  } from '../../../../../../packages/domins';
import { CustomerRepository } from '../../customer.repository';
import { CustomerMapper} from '../mappers/customer.mapper';
import { EntityCondition } from '../../../../../../utils/types/entity-condition.type';
import{CustomerEntity} from '../entities/customer.entity'
@Injectable()
export class CustomersRelationalRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>


  ) {}

  async createCustomer(data: Customer): Promise<Customer> {
    const persistenceModel = CustomerMapper.toPersistence(data); // CustomerEntity
    const newEntity = await this.customerRepository.save(
      this.customerRepository.create(persistenceModel)
    );
    return CustomerMapper.toDomain(newEntity); // returns Customer
  
  }


  async getCustomerById(customerId: number): Promise<Customer> {
    const entity = await this.customerRepository.findOneBy({ id: customerId });
    if (!entity) throw new Error('Customer not found');
    return CustomerMapper.toDomain(entity);
  }

  async getAllOrg(): Promise<Customer[]> {
    return this.customerRepository.find();  }

 

}