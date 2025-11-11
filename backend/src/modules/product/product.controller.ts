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
  import { ProductsService } from './product.service';
  import { CreateProductDto } from '@/packages/dto/order/create-product.dto';
  import { CreateVariantDto } from '@/packages/dto/order/create-variant.dto'
  import {ListProductsQuery} from '@/packages/dto/order/list-products.query'
  @Controller('products')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @Post()
    async create(@Body() dto: CreateProductDto) {
      const product = await this.service.create(dto);
      return product; // already domain-shaped
    }

    @Get()
    async list(@Query() q: ListProductsQuery) {
      return this.service.list(q);
    }

    @Post(':id/variants')
    async addVariant(
      @Param('id', ParseIntPipe) id: number,
      @Body()
      body: {
        size: string;
        color: string;
        unitPrice: string;
        currency: string;
      },
    ) {
      return this.service.addVariant(id, body);
    }
  }
  