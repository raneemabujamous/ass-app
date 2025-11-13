import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'dw_dim_product' })
export class DimProductEntity {
  @PrimaryColumn({ type: 'int' }) product_id!: number;
  @Column({ type: 'varchar', length: 64 }) sku!: string;
  @Column({ type: 'varchar', length: 255 }) name!: string;
  @Column({ type: 'varchar', length: 255 , nullable:true}) price!: string;

}