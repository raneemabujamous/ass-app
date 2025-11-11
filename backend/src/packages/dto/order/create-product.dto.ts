import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString, Length, ValidateNested } from 'class-validator';
import {CreateVariantDto } from './create-variant.dto';

import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @Length(1, 64)
  sku: string;
  
  
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;



  @ApiProperty({ type: () => [CreateVariantDto] })
  @IsArray() @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];
  
  }

  