import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';
export class RevenueOverTimeQuery {
  @ApiPropertyOptional({ enum: ['daily', 'monthly'], default: 'daily' })
  @IsIn(['daily', 'monthly'])
  granularity: 'daily' | 'monthly' = 'daily';

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  endDate?: string;
}