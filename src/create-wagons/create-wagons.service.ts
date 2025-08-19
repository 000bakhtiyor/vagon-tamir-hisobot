import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreateWagonDto } from './dto/create-create-wagon.dto';
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

  async create(createCreateWagonDto: CreateCreateWagonDto) {
    const existingDepot = await this.wagonDepotRepository.findOne({
      where: { id: createCreateWagonDto.wagonDepotId },
    });

    if (!existingDepot) {
      throw new NotFoundException('Wagon Depot not found');
    }

    const createWagon = this.createWagonRepository.create({
      ...createCreateWagonDto,
      wagonDepot: existingDepot,
      createdAt: createCreateWagonDto.createdAt ?? new Date(),
    });

    return this.createWagonRepository.save(createWagon);
  }

  async findAll() {
    return this.createWagonRepository.find({
      relations: ['wagonDepot'],
      order: { createdAt: 'DESC' },
    });
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

    Object.assign(wagon, updateCreateWagonDto);

    return this.createWagonRepository.save(wagon);
  }

  async remove(id: string) {
    const wagon = await this.findOne(id);
    return this.createWagonRepository.remove(wagon);
  }
}
