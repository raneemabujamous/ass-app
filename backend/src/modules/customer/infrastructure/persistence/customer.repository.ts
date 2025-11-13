import { DeepPartial } from '../../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../utils/types/nullable.type';
import { Customer } from '../../../../packages/domins';

export abstract class CustomerRepository {

  abstract createCustomer(
    data: Omit<Customer, 'id'|'createdAt' | 'deletedAt' | 'updatedAt'>
  ): Promise<Customer>;


  abstract getAllOrg(
  ): Promise<Customer[]>;


  
  abstract getCustomerById(id:number): Promise<Customer>

}
