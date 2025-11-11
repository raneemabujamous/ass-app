import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class TopProductsQuery {
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @IsInt() @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  endDate?: string;
}
