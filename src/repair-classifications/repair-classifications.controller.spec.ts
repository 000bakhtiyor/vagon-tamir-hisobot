import { Test, TestingModule } from '@nestjs/testing';
import { RepairClassificationsController } from './repair-classifications.controller';
import { RepairClassificationsService } from './repair-classifications.service';

describe('RepairClassificationsController', () => {
  let controller: RepairClassificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairClassificationsController],
      providers: [RepairClassificationsService],
    }).compile();

    controller = module.get<RepairClassificationsController>(RepairClassificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
