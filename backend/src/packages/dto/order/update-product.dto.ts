import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export enum ProjectStatus {
  ACTIVE = "active",
  COMPLETED = "completed"
}

export class UpdateProjectDto {

  @ApiProperty({ example: 'completed' })
  @IsNotEmpty()
  status: ProjectStatus;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  project_title: string ;

  @ApiProperty({ example:1 })
  @IsNotEmpty()
  organization_id: number ;

  @ApiProperty({ example:1 })
  @IsNotEmpty()
  project_id: number ;
  
}
