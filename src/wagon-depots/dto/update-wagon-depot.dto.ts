import { PartialType } from '@nestjs/swagger';
import { CreateWagonDepotDto } from './create-wagon-depot.dto';

export class UpdateWagonDepotDto extends PartialType(CreateWagonDepotDto) {}
