import { Test, TestingModule } from '@nestjs/testing';
import { ImportVagonsService } from './import-vagons.service';

describe('ImportVagonsService', () => {
  let service: ImportVagonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportVagonsService],
    }).compile();

    service = module.get<ImportVagonsService>(ImportVagonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
