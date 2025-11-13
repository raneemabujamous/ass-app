import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';

  import { ProductsService } from './product.service';
  import { CreateProductDto } from '@/packages/dto/order/create-product.dto';
  import { CreateVariantDto } from '@/packages/dto/order/create-variant.dto'
  import {ListProductsQuery} from '@/packages/dto/order/list-products.query'
  @ApiTags('products')@
  Controller('products')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @Post()
    async create(@Body() dto: CreateProductDto) {
      const product = await this.service.create(dto);
      return product; 
    }

    @Get()
    async getAllProduct() {
      return this.service.getAllProduct();
    }

    @Post(':id/variants')
    async addVariant(
      @Param('id', ParseIntPipe) id: number,
      @Body() createVariantDto :CreateVariantDto,
    ) {
      return this.service.addVariant(id, createVariantDto);
    }
  }
  