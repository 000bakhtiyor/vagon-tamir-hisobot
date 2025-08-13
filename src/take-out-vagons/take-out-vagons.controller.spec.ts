import { Test, TestingModule } from '@nestjs/testing';
import { TakeOutVagonsController } from './take-out-vagons.controller';
import { TakeOutVagonsService } from './take-out-vagons.service';

describe('TakeOutVagonsController', () => {
  let controller: TakeOutVagonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TakeOutVagonsController],
      providers: [TakeOutVagonsService],
    }).compile();

    controller = module.get<TakeOutVagonsController>(TakeOutVagonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
