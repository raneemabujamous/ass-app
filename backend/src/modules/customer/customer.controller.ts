import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CustomersService } from './customer.service';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { Customer } from '@/packages/domins';
import {CreateCustomerDto} from '@/packages/dto/customer/index'
@ApiTags('Customers')
@Controller({
  path: 'customer',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOne(
    @Body() createCustomerDto: CreateCustomerDto,
    
  ): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }



  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllOrg(
  ): Promise<Customer[]> {
    let data = await this.customerService.getAllOrg();
    return data;
  }

}


