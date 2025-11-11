import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Length, ValidateNested, IsNumber, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';
class OrderItemInput {
    @ApiProperty({ example: 1 })
    @IsNumber()
    productId: number;
    
    
    @ApiProperty({ example: 2 })
    @IsNumber()
    quantity: number;
    
    
    @ApiProperty({ example: 0, required: false })
    @IsNumberString()
    @IsOptional()
    discount?: string; // 0.00
    
    
    @ApiProperty({ example: 0.1, required: false })
    @IsNumberString()
    @IsOptional()
    taxRate?: string; // 0.1000
    
    
    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    variantId?: number;
    }
    
    
    export class CreateOrderDto {
    @ApiProperty({ example: 'Jane Doe' })
    @IsString()
    @Length(1, 255)
    customerName: string;
    
    
    @ApiProperty({ example: 'jane@example.com', required: false })
    @IsEmail()
    @IsOptional()
    customerEmail: string;
    
    
    @ApiProperty({ type: [OrderItemInput] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemInput)
    items: OrderItemInput[];
    
    
    @ApiProperty({ example: 'USD', required: false })
    @IsString()
    @IsOptional()
    currency?: string;
    }