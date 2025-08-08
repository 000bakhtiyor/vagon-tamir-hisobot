import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>
  ){}
  async create(createStationDto: CreateStationDto) {
    
    const existingStation = await this.stationRepository.findOne({ where: { name: createStationDto.name } });
    if (existingStation) {
      throw new Error(`Station with name "${createStationDto.name}" already exists.`);
    }

    const existingDepot = await this.stationRepository.findOne({ where: { wagonDepot: { id: createStationDto.wagonDepotId } } });
    if (!existingDepot) {
      throw new Error(`Wagon depot with ID "${createStationDto.wagonDepotId}" does not exist.`);
    }
    
    const newStation = await this.stationRepository.create(createStationDto);
    return this.stationRepository.save(newStation);
  }

}
