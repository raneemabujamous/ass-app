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

  async list(query: any) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    const qb = this.repo.productQb('p').leftJoinAndSelect('p.variants', 'v');

    if (query.q) qb.andWhere('(p.sku ILIKE :q OR p.name ILIKE :q)', { q: `%${query.q}%` });
    if (query.sku) qb.andWhere('p.sku ILIKE :sku', { sku: `%${query.sku}%` });
    if (query.size) qb.andWhere('v.size ILIKE :size', { size: `%${query.size}%` });
    if (query.color)
      qb.andWhere('v.color ILIKE :color', { color: `%${(query.color || '').toUpperCase()}%` });

    const includeEmpty = (query.includeEmpty ?? 'true') === 'true';
    if (!includeEmpty) qb.andWhere('v.id IS NOT NULL');

    qb.take(limit).skip(skip).orderBy('p.id', 'DESC').addOrderBy('v.id', 'ASC');

    const [rows, total] = await qb.getManyAndCount();
    return {
      data: rows.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        variants: (p.variants ?? []).map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          unitPrice: v.unitPrice,
          currency: v.currency,
        })),
      })),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async addVariant(productId: number, payload: { size: string; color: string; unitPrice: string; currency: string }) {
    return this.repo.addVariant(productId, payload);
  }
}
