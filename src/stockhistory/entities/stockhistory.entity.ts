// src/stockhistory/entities/stock-history.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;

  @Column()
  action: 'in' | 'out';

  @Column()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;
}
