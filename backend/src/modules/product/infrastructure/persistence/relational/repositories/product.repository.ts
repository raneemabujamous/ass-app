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
import { Product, ProductVariant } from '@/packages/domins';
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

  async getAllProduct() : Promise<any>{
    const products = await this.productRepo.find({
      relations: ['variants'], 
    });
    return products;
  }

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
        price: dto.price,

        variants: norm.map((v:any) => em.getRepository(ProductVariantEntity).create({
          size: v.size ?? '',
          color: v.color ?? '',
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
    product_variant_id: number;
    product_id: number;
    size: string;
    color: string;
  }> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const variant = this.variantRepo.create({
      product,
      size: payload.size ?? '',
      color: payload.color?.toUpperCase?.() ?? payload.color ?? '',
    });

    try {
      const saved = await this.variantRepo.save(variant);
      return {
        product_variant_id:saved.product_variant_id,
        product_id: productId,
        size: saved.size,
        color: saved.color,
      };
    } catch (e: any) {
      if (e?.code === '23505' || e?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Variant already exists for this product (size/color must be unique)');
      }
      throw e;
    }
  }

  async findVerId(id:number): Promise<ProductVariant | null>{
    const product = await this.variantRepo.findOne({ where: { product_variant_id: id } });
return product
  }


  
  
  }   