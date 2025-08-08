import { Test, TestingModule } from '@nestjs/testing';
import { OwnershipsController } from './ownerships.controller';
import { OwnershipsService } from './ownerships.service';

describe('OwnershipsController', () => {
  let controller: OwnershipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnershipsController],
      providers: [OwnershipsService],
    }).compile();

    controller = module.get<OwnershipsController>(OwnershipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
