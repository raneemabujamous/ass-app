import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsQuery {

  @ApiPropertyOptional() @IsOptional() @IsString()
  sku?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  size?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  color?: string;

}
