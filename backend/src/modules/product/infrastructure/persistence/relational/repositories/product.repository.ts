import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ProductRepository } from '../../product.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { Product } from '@/packages/domins';
import { CreateProductDto } from '@/packages/dto/order/create-product.dto';

@Injectable()
export class ProductRelationalRepository implements ProductRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,
  ) {}

  // ---- Transactions
  async transaction<T>(work: (em: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }

  // ---- QueryBuilder
  productQb(alias = 'p'): SelectQueryBuilder<ProductEntity> {
    return this.productRepo.createQueryBuilder(alias);
  }

  // ---- CRUD (domain level)

  async createProduct(dto: CreateProductDto): Promise<any> {
    return this.transaction(async (em) => {
      const norm = (dto.variants ?? []).map(v => ({
        ...v,
        color: v.color?.toUpperCase?.() ?? v.color,
      }));
  
      const exists = await em.getRepository(ProductEntity).findOne({ where: { sku: dto.sku } });
      if (exists) throw new ConflictException('SKU already exists');
  
      const entity = em.getRepository(ProductEntity).create({
        sku: dto.sku,
        name: dto.name,
        variants: norm.map((v:any) => em.getRepository(ProductVariantEntity).create({
          size: v.size ?? '',
          color: v.color ?? '',
          unitPrice: v.unitPrice ?? '0',
          currency: v.currency ?? 'USD',
        })),
      });
  
      let saved = await em.getRepository(ProductEntity).save(entity);
  
      // ✅ reload with relations to ensure variants are present
      saved = await em.getRepository(ProductEntity).findOneOrFail({
        where: { id: saved.id },
        relations: { variants: true },
      });
  
      return ProductMapper.toDomain(saved);
    });
  }
  
  async findById(id: number): Promise<Product | null> {
    const entity = await this.productRepo.findOne({
      where: { id },
      relations: { variants: true },
    });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findEntityById(id: number): Promise<ProductEntity | null> {
    return this.productRepo.findOne({ where: { id } });
  }

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.productRepo.findOne({
      where: { sku },
      relations: { variants: true },
    });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async addVariant(
    productId: number,
    payload: { size: string; color: string; unitPrice: string; currency: string },
  ): Promise<{
    id: number;
    productId: number;
    size: string;
    color: string;
    unitPrice: string;
    currency: string;
  }> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const variant = this.variantRepo.create({
      product,
      size: payload.size ?? '',
      color: payload.color?.toUpperCase?.() ?? payload.color ?? '',
      unitPrice: payload.unitPrice ?? '0',
      currency: payload.currency ?? 'USD',
    });

    try {
      const saved = await this.variantRepo.save(variant);
      return {
        id: saved.id,
        productId: productId,
        size: saved.size,
        color: saved.color,
        unitPrice: saved.unitPrice,
        currency: saved.currency,
      };
    } catch (e: any) {
      if (e?.code === '23505' || e?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Variant already exists for this product (size/color must be unique)');
      }
      throw e;
    }
  }
}
