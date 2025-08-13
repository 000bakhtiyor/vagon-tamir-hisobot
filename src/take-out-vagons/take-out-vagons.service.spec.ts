import { Test, TestingModule } from '@nestjs/testing';
import { TakeOutVagonsService } from './take-out-vagons.service';

describe('TakeOutVagonsService', () => {
  let service: TakeOutVagonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TakeOutVagonsService],
    }).compile();

    service = module.get<TakeOutVagonsService>(TakeOutVagonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
