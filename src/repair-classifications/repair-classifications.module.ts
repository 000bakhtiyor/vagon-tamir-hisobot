import { Module } from '@nestjs/common';
import { RepairClassificationsService } from './repair-classifications.service';
import { RepairClassificationsController } from './repair-classifications.controller';
import { RepairClassification } from './entities/repair-classification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RepairClassification])],
  controllers: [RepairClassificationsController],
  providers: [RepairClassificationsService],
})
export class RepairClassificationsModule {}
