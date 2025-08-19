import { Test, TestingModule } from '@nestjs/testing';
import { CreateWagonsService } from './create-wagons.service';

describe('CreateWagonsService', () => {
  let service: CreateWagonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateWagonsService],
    }).compile();

    service = module.get<CreateWagonsService>(CreateWagonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
