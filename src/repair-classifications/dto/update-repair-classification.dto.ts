import { PartialType } from '@nestjs/swagger';
import { CreateRepairClassificationDto } from './create-repair-classification.dto';

export class UpdateRepairClassificationDto extends PartialType(CreateRepairClassificationDto) {}
