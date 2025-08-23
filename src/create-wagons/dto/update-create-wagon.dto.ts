import { PartialType } from '@nestjs/swagger';
import { CreateWagonDto } from './create-create-wagon.dto';

export class UpdateCreateWagonDto extends PartialType(CreateWagonDto) {}
