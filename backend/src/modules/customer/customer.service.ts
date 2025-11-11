import {
  Injectable,
} from '@nestjs/common';
import { CustomerRepository } from './infrastructure/persistence/customer.repository';
import { NullableType } from '@/utils/types/nullable.type';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import {CreateCustomerDto}  from '@/packages/dto/customer'
import { Customer } from '@/packages/domins';
import { isEmail } from 'class-validator';
import { BadRequestException, ConflictException } from '@nestjs/common';

@Injectable()
export class CustomersService {
  constructor(private readonly customerRepository: CustomerRepository,

  ) {}  
  async create(
    data: Omit<
    CreateCustomerDto,
    'createdAt' | 'updatedAt' | 'deletedAt'
    >
  ,): Promise<Customer> {
    
    const email = data.email?.toLowerCase().trim();
  
    if (!email || !isEmail(email)) {
      throw new BadRequestException('not correct email');
    }
    const customer = await this.customerRepository.createCustomer(data    );


    return customer;
  }

  getAllOrg(): Promise<Customer[]> {
    return this.customerRepository.getAllOrg();
  }

  
  
}
