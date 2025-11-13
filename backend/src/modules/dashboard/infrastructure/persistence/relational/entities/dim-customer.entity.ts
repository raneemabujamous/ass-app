import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'dw_dim_customer' })
export class DimCustomerEntity {
  @PrimaryColumn({ type: 'int' }) customer_id!: number;
  @Column({ type: 'varchar', length: 255 }) name!: string;
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true }) email!: string | null;
}
