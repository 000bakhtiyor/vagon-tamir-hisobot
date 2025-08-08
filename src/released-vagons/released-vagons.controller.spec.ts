import { Test, TestingModule } from '@nestjs/testing';
import { ReleasedVagonsController } from './released-vagons.controller';
import { ReleasedVagonsService } from './released-vagons.service';

describe('ReleasedVagonsController', () => {
  let controller: ReleasedVagonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleasedVagonsController],
      providers: [ReleasedVagonsService],
    }).compile();

    controller = module.get<ReleasedVagonsController>(ReleasedVagonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
