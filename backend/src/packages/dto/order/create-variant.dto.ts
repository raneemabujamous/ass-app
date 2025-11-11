import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
    @ApiProperty()
    @IsOptional() @IsString()
    q?: string; // searches name/sku

    @ApiProperty()

    @IsOptional() @IsString()
    sku?: string;
    @ApiProperty()

    @IsOptional() @IsString()
    size?: string;
    @ApiProperty()

    @IsOptional() @IsString()
    color?: string;
    @ApiProperty()

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page?: number = 1;
    @ApiProperty()

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    limit?: number = 20;

    // include products with zero variants (default true)
    @ApiProperty()

    @IsOptional()
    includeEmpty?: 'true' | 'false';
}
