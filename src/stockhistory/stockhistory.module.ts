import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockHistoryService } from './stockhistory.service';
import { StockHistoryController } from './stockhistory.controller';
import { StockHistory } from './entities/stockhistory.entity';
import { Product } from '../products/entities/product.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockHistory, Product, User]),
    JwtModule.register({
      secret: 'chave-super-ultra-secreta-jwt',
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
  ],
  providers: [StockHistoryService, UsersService],
  controllers: [StockHistoryController],
})
export class StockHistoryModule {}
