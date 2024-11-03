import { Test, TestingModule } from '@nestjs/testing';
import { StockHistoryController } from './stockhistory.controller';
import { StockHistoryService } from './stockhistory.service';

describe('StockHistoryController', () => {
  let controller: StockHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockHistoryController],
      providers: [StockHistoryService],
    }).compile();

    controller = module.get<StockHistoryController>(StockHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
