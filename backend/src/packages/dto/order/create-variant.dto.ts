import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {


    @ApiProperty({ example: 'eee' })
    @IsOptional() @IsString()
    size: string;

    @ApiProperty({ example: 'ee' })
    @IsOptional() @IsString()
    color: string;
}
