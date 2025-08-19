import { Test, TestingModule } from '@nestjs/testing';
import { CreateWagonsController } from './create-wagons.controller';
import { CreateWagonsService } from './create-wagons.service';

describe('CreateWagonsController', () => {
  let controller: CreateWagonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateWagonsController],
      providers: [CreateWagonsService],
    }).compile();

    controller = module.get<CreateWagonsController>(CreateWagonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
