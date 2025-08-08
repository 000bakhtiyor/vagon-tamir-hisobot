import { Test, TestingModule } from '@nestjs/testing';
import { WagonDepotsService } from './wagon-depots.service';

describe('WagonDepotsService', () => {
  let service: WagonDepotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WagonDepotsService],
    }).compile();

    service = module.get<WagonDepotsService>(WagonDepotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
