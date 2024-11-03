// src/stockhistory/dto/create-stock-history.dto.ts
import { IsEnum, IsInt } from 'class-validator';

export class CreateStockHistoryDto {
  @IsInt()
  productId: number;

  @IsEnum(['in', 'out'])
  action: 'in' | 'out';

  @IsInt()
  userId: number;
}
