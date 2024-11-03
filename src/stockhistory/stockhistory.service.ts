import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockHistory } from './entities/stockhistory.entity';
import { Product } from '../products/entities/product.entity';
import { UsersService } from '../users/users.service';
import { CreateStockHistoryDto } from './dto/create-stockhistory.dto';

interface StockHistoryEntry {
  productName: string;
  action: 'in' | 'out';
  timestamp: Date;
  userName: string;
}

@Injectable()
export class StockHistoryService {
  constructor(
    @InjectRepository(StockHistory)
    private stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  async createStockEntry(dto: CreateStockHistoryDto): Promise<StockHistory> {
    const product = await this.productsRepository.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const user = await this.usersService.findOneById(dto.userId);

    if (dto.action === 'in') {
      product.quantity += 1;
    } else if (dto.action === 'out') {
      if (product.quantity <= 0) {
        throw new Error('Insufficient stock');
      }
      product.quantity -= 1;
    }

    await this.productsRepository.save(product);

    const stockHistory = this.stockHistoryRepository.create({
      product,
      action: dto.action,
      timestamp: new Date(),
      user,
    });

    return this.stockHistoryRepository.save(stockHistory);
  }

  async getStockHistory(): Promise<StockHistoryEntry[]> {
    const stockHistoryEntries = await this.stockHistoryRepository.find({
      relations: ['product', 'user'],
      order: { timestamp: 'DESC' },
    });

    return stockHistoryEntries.map((entry) => ({
      productName: entry.product.name, // Obtendo o nome do produto
      action: entry.action,
      timestamp: entry.timestamp,
      userName: entry.user.name, // Supondo que o nome do usuário está na propriedade 'name' do objeto user
    }));
  }
}
