import { PartialType } from '@nestjs/mapped-types';
import { CreateVagonDto } from './create-vagon.dto';

export class UpdateVagonDto extends PartialType(CreateVagonDto) {}
