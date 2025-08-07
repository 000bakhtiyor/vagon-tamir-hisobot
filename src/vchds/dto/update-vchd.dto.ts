import { PartialType } from '@nestjs/mapped-types';
import { CreateVchdDto } from './create-vchd.dto';

export class UpdateVchdDto extends PartialType(CreateVchdDto) {}
