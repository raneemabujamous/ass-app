import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsQuery {
  @ApiPropertyOptional() @IsOptional() @IsString()
  q?: string;          // full-text on sku/name

  @ApiPropertyOptional() @IsOptional() @IsString()
  sku?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  size?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  color?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit: number = 20;

  @ApiPropertyOptional() @IsOptional()
  includeEmpty?: 'true' | 'false'; // exclude products with 0 variants if 'false'
}
