import { Injectable } from '@nestjs/common';
import { CreateRepairClassificationDto } from './dto/create-repair-classification.dto';
import { UpdateRepairClassificationDto } from './dto/update-repair-classification.dto';

@Injectable()
export class RepairClassificationsService {
  create(createRepairClassificationDto: CreateRepairClassificationDto) {
    return 'This action adds a new repairClassification';
  }

  findAll() {
    return `This action returns all repairClassifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repairClassification`;
  }

  update(id: number, updateRepairClassificationDto: UpdateRepairClassificationDto) {
    return `This action updates a #${id} repairClassification`;
  }

  remove(id: number) {
    return `This action removes a #${id} repairClassification`;
  }
}
