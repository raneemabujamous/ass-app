import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class OrdersByCustomerQuery {
  @ApiPropertyOptional({ default: 15 }) @IsOptional() @IsInt() @Min(1)
  limit?: number = 15;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  endDate?: string;
}
