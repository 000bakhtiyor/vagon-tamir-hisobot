import { Injectable } from '@nestjs/common';
import { CreateWagonDepotDto } from './dto/create-wagon-depot.dto';
import { UpdateWagonDepotDto } from './dto/update-wagon-depot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WagonDepot } from './entities/wagon-depot.entity';

@Injectable()
export class WagonDepotsService {

  constructor(
    @InjectRepository(WagonDepot)
    private readonly wagonDepotRepository: Repository<WagonDepot>
  ) {}
  async create(createWagonDepotDto: CreateWagonDepotDto) {
    const existingDepot = await this.wagonDepotRepository.findOne({ where: { name: createWagonDepotDto.name } });
    if (existingDepot) {
      throw new Error(`Wagon depot with name "${createWagonDepotDto.name}" already exists.`);
    }
    const newDepot = await this.wagonDepotRepository.create(createWagonDepotDto);
    return this.wagonDepotRepository.save(newDepot);
  }

}
