import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';


export class CreateCustomerDto {

  @ApiProperty({ example: 'nx' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'nx' })
  @IsNotEmpty()
  email: string;

}
