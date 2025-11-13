import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'dw_fact_sales' })
export class FactSalesEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Index() @Column({ type: 'int' }) order_id!: number;
  @Index() @Column({ type: 'int' }) order_item_id!: number;

  @Index() @Column({ type: 'int' }) date_key!: number;     // yyyymmdd
  @Index() @Column({ type: 'int' }) customer_id!: number;
  @Index() @Column({ type: 'int' , nullable:true }) product_id!: number;
  @Index() @Column({ type: 'int' }) product_variant_id!: number;


  
  @Column({ type: 'int' }) quantity!: number;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) unit_price!: string;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) total!: string;

  @Column({ type: 'varchar', length: 8 }) currency!: string;
}
