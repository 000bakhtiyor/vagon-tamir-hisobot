import { Test, TestingModule } from '@nestjs/testing';
import { ImportVagonsController } from './import-vagons.controller';
import { ImportVagonsService } from './import-vagons.service';

describe('ImportVagonsController', () => {
  let controller: ImportVagonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportVagonsController],
      providers: [ImportVagonsService],
    }).compile();

    controller = module.get<ImportVagonsController>(ImportVagonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
