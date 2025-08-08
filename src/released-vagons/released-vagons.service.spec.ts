import { Test, TestingModule } from '@nestjs/testing';
import { ReleasedVagonsService } from './released-vagons.service';

describe('ReleasedVagonsService', () => {
  let service: ReleasedVagonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReleasedVagonsService],
    }).compile();

    service = module.get<ReleasedVagonsService>(ReleasedVagonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
