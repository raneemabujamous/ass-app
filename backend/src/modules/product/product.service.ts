import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductDto } from '@/packages/dto/order/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductRepository) {}

  async create(dto: CreateProductDto) {
    const existing = await this.repo.findBySku(dto.sku);
    if (existing) throw new ConflictException('SKU already exists');
    return this.repo.createProduct(dto);
  }

  async getAllProduct() {
return this.repo.getAllProduct()
  }

  async addVariant(productId: number, payload: { size: string; color: string }) {
    return this.repo.addVariant(productId, payload);
  }
  async findById(id:number){
    return this.repo.findById(id)
  }

  async findVerId(id:number){
    return this.repo.findVerId(id)
  }
}
