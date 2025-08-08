import { Injectable } from '@nestjs/common';
import { CreateReleasedVagonDto } from './dto/create-released-vagon.dto';
import { UpdateReleasedVagonDto } from './dto/update-released-vagon.dto';

@Injectable()
export class ReleasedVagonsService {
  create(createReleasedVagonDto: CreateReleasedVagonDto) {
    return 'This action adds a new releasedVagon';
  }

  findAll() {
    return `This action returns all releasedVagons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} releasedVagon`;
  }

  update(id: number, updateReleasedVagonDto: UpdateReleasedVagonDto) {
    return `This action updates a #${id} releasedVagon`;
  }

  remove(id: number) {
    return `This action removes a #${id} releasedVagon`;
  }
}
