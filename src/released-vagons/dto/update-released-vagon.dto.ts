import { PartialType } from '@nestjs/swagger';
import { CreateReleasedVagonDto } from './create-released-vagon.dto';

export class UpdateReleasedVagonDto extends PartialType(CreateReleasedVagonDto) {}
