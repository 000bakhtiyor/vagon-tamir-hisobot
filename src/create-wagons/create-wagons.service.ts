import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWagonDto } from './dto/create-create-wagon.dto';
import { UpdateCreateWagonDto } from './dto/update-create-wagon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { Repository } from 'typeorm';
import { CreateWagon } from './entities/create-wagon.entity';

@Injectable()
export class CreateWagonsService {
  constructor(
    @InjectRepository(CreateWagon)
    private readonly createWagonRepository: Repository<CreateWagon>,
    @InjectRepository(WagonDepot)
    private readonly wagonDepotRepository: Repository<WagonDepot>,
  ) { }

  async create(CreateWagonDto: CreateWagonDto) {
    const existingDepot = await this.wagonDepotRepository.findOne({
      where: { id: CreateWagonDto.wagonDepotId },
    });

    if (!existingDepot) {
      throw new NotFoundException('Wagon Depot not found');
    }

    const createWagon = this.createWagonRepository.create({
      ...CreateWagonDto,
      wagonDepot: existingDepot,
      createdAt: CreateWagonDto.createdAt ?? new Date(),
    });

    return this.createWagonRepository.save(createWagon);
  }

  async findAll(page: number = 1, limit: number = 10, wagonNumber?: string) {
    const qb = this.createWagonRepository
      .createQueryBuilder('wagon')
      .leftJoinAndSelect('wagon.wagonDepot', 'wagonDepot')
      .orderBy('wagon.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (wagonNumber) {
      qb.andWhere('wagon.number ILIKE :wagonNumber', {
        wagonNumber: `%${wagonNumber}%`,
      });
    }

    return qb.getMany();
  }

  async findAllWithDepots(page: number = 1, limit: number = 10) {
    const qb = this.wagonDepotRepository
      .createQueryBuilder('depot')
      .loadRelationCountAndMap('depot.createdWagonsCount', 'depot.createWagons')
      .skip((page - 1) * limit)
      .take(limit);

    const depots = await qb.getMany();

    const totalCreatedWagons = await this.wagonDepotRepository
      .createQueryBuilder('depot')
      .leftJoin('depot.createWagons', 'createWagons')
      .select('COUNT(createWagons.id)', 'count')
      .getRawOne<{ count: string }>();

    return {
      depots,
      totalCreatedWagons: Number(totalCreatedWagons?.count ?? 0),
    };
  }




  async findOne(id: string) {
    const wagon = await this.createWagonRepository.findOne({
      where: { id },
      relations: ['wagonDepot'],
    });

    if (!wagon) {
      throw new NotFoundException(`CreateWagon with ID ${id} not found`);
    }

    return wagon;
  }

  async update(id: string, updateCreateWagonDto: UpdateCreateWagonDto) {
    const wagon = await this.findOne(id);
    if (!wagon) {
      throw new NotFoundException(`CreateWagon with ID ${id} not found`);
    }

    const { wagonDepotId, ...rest } = updateCreateWagonDto;
    let wagonDepot: WagonDepot | null = null;

    if (wagonDepotId) {
      wagonDepot = await this.wagonDepotRepository.findOneBy({ id: wagonDepotId });
      if (!wagonDepot) {
        throw new NotFoundException(`Depot with ID ${wagonDepotId} not found`);
      }
    }

    Object.assign(wagon, rest);

    if (wagonDepot) {
      wagon.wagonDepot = wagonDepot;
    }

    return this.createWagonRepository.save(wagon);
  }


  async remove(id: string) {
    const wagon = await this.findOne(id);
    return this.createWagonRepository.remove(wagon);
  }
}
