// src/stockhistory/stock-history.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { StockHistoryService } from './stockhistory.service';
import { CreateStockHistoryDto } from './dto/create-stockhistory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockHistory } from './entities/stockhistory.entity';

interface StockHistoryEntry {
  productName: string;
  action: 'in' | 'out';
  timestamp: Date;
  userName: string;
}

@Controller('stockhistory')
export class StockHistoryController {
  constructor(private readonly stockHistoryService: StockHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createStockHistory(@Body() dto: CreateStockHistoryDto) {
    return this.stockHistoryService.createStockEntry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllStockHistory(): Promise<StockHistoryEntry[]> {
    return this.stockHistoryService.getStockHistory();
  }
}
