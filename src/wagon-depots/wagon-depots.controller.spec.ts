import { Test, TestingModule } from '@nestjs/testing';
import { WagonDepotsController } from './wagon-depots.controller';
import { WagonDepotsService } from './wagon-depots.service';

describe('WagonDepotsController', () => {
  let controller: WagonDepotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WagonDepotsController],
      providers: [WagonDepotsService],
    }).compile();

    controller = module.get<WagonDepotsController>(WagonDepotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
