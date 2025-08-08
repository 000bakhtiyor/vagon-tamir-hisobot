import { Injectable } from '@nestjs/common';
import { CreateOwnershipDto } from './dto/create-ownership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ownership } from './entities/ownership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OwnershipsService {

  constructor(
    @InjectRepository(Ownership) private ownershipRepository: Repository<Ownership>,
  ) {}
  async create(createOwnershipDto: CreateOwnershipDto) {
    const exportedOwnership = await this.ownershipRepository.findOne({
      where: { ownershipName: createOwnershipDto.ownershipName },
    });
    if (exportedOwnership) {
      throw new Error('Ownership with this name already exists');
    }
    const ownership = await this.ownershipRepository.create(createOwnershipDto);
    return this.ownershipRepository.save(ownership);
  }

}
