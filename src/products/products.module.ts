import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    JwtModule.register({
      secret: 'chave-super-ultra-secreta-jwt',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
