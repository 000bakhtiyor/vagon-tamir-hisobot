import { Test, TestingModule } from '@nestjs/testing';
import { RepairClassificationsService } from './repair-classifications.service';

describe('RepairClassificationsService', () => {
  let service: RepairClassificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairClassificationsService],
    }).compile();

    service = module.get<RepairClassificationsService>(RepairClassificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
