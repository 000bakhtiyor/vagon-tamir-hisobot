import { Module } from '@nestjs/common';
import { RepairClassificationsService } from './repair-classifications.service';
import { RepairClassificationsController } from './repair-classifications.controller';

@Module({
  controllers: [RepairClassificationsController],
  providers: [RepairClassificationsService],
})
export class RepairClassificationsModule {}
