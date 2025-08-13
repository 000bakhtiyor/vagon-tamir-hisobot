import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { RolesEnum } from 'src/common/enums/role.enum';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    @InjectRepository(WagonDepot)
    private readonly wagonDepotRepository: Repository<WagonDepot>
  ) { }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const depot = await this.wagonDepotRepository.findOne({
      where: { id: createStationDto.wagonDepotId }
    });
    if (!depot) {
      throw new NotFoundException(
        `WagonDepot with id ${createStationDto.wagonDepotId} not found`
      );
    }

    const station = this.stationRepository.create({
      name: createStationDto.name,
      wagonDepot: depot
    });
    return this.stationRepository.save(station);
  }

  async findAll(role: RolesEnum, depoId: string): Promise<{ id: string }[]> {
    const qb = this.stationRepository.createQueryBuilder('station')

    if (role !== RolesEnum.SUPERADMIN) {
      qb.innerJoin('station.wagonDepot', 'depot')
        .where('depot.id = :depoId', { depoId });
    }

    return qb.getMany();
  }


  async findOne(id: string): Promise<BaseResponseDto<Station>> {
    const existingStation = await this.stationRepository.findOne({
      where: { id },
      relations: ['wagonDepot', 'releasedVagons']
    });

    if (!existingStation) {
      return new BaseResponseDto(
        {} as Station,
        `Station with id ${id} not found`,
        404
      );
    }

    return new BaseResponseDto(
      existingStation,
      'Station retrieved successfully',
      200
    );
  }

  async update(id: string, updateStationDto: UpdateStationDto): Promise<Station> {
    const station = await this.stationRepository.findOneBy({id});
    if (!station) {
      throw new NotFoundException(`Station with id ${id} not found`);
    }
    
    Object.assign(station, updateStationDto)

    return this.stationRepository.save(station);
  }

  async remove(id: string): Promise<void> {
    const station = await this.stationRepository.findOneBy({id});
    if (!station) {
      throw new NotFoundException(`Station with id ${id} not found`);
    }
    await this.stationRepository.remove(station);
  }
}
