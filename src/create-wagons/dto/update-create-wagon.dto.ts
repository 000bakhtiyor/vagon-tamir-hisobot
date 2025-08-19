import { PartialType } from '@nestjs/swagger';
import { CreateCreateWagonDto } from './create-create-wagon.dto';

export class UpdateCreateWagonDto extends PartialType(CreateCreateWagonDto) {}
