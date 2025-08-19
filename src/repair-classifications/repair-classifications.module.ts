import { Module } from '@nestjs/common';
import { RepairClassificationsService } from './repair-classifications.service';
import { RepairClassificationsController } from './repair-classifications.controller';
import { RepairClassification } from './entities/repair-classification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairClassificationGroup } from './entities/repair-classification-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepairClassification, RepairClassificationGroup])],
  controllers: [RepairClassificationsController],
  providers: [RepairClassificationsService],
})
export class RepairClassificationsModule {}
