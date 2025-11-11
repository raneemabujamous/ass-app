import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'dw_dim_date' })
export class DimDateEntity {
  @PrimaryColumn({ type: 'int' })
  date_key!: number; // yyyymmdd

  @Column({ type: 'date' }) date!: Date;
  @Column({ type: 'int' }) year!: number;
  @Column({ type: 'int' }) month!: number;
  @Column({ type: 'int' }) day!: number;
  @Column({ type: 'int' }) iso_week!: number;
}
