
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ProductsModule } from '@/modules/product/product.module';
import { OrdersModule } from './modules/order/order.module';
import { CustomerModule } from '@/modules/customer/customer.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'MYDKHDR@2018',
        database: 'project_tracker',
        autoLoadEntities: true,
        synchronize: true,
      }),
      dataSourceFactory: async (options: DataSourceOptions | undefined) => {
        if (!options) {
          throw new Error('TypeORM options are undefined.');
        }
        return new DataSource(options).initialize();
      },
    }),
    OrdersModule,
    CustomerModule,
    ProductsModule,
  ],
})
export class AppModule {}