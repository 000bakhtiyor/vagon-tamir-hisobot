import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vagon } from './entities/vagon.entity';
import { CreateVagonDto } from './dto/create-vagon.dto';
import { UpdateVagonDto } from './dto/update-vagon.dto';
import { Vchd } from 'src/vchds/entities/vchd.entity';

@Injectable()
export class VagonsService {
  constructor(
    @InjectRepository(Vagon)
    private vagonRepo: Repository<Vagon>,

    @InjectRepository(Vchd)
    private vchdRepo: Repository<Vchd>,
  ) { }



  async create(dto: CreateVagonDto): Promise<Vagon> {
    let vchd: Vchd;

    try {
      vchd = await this.vchdRepo.findOneByOrFail({ id: dto.vchdId });
    } catch (error) {
      throw new NotFoundException(`VCHD not found with id: ${dto.vchdId}`);
    }

    let importedTime: Date;
    let timeTakenOut: Date | null = null;

    try {
      importedTime = dto.importedTime ? new Date(dto.importedTime) : new Date();
      if (isNaN(importedTime.getTime())) {
        throw new Error();
      }
    } catch {
      throw new BadRequestException('Invalid importedTime format');
    }

    if (dto.timeTakenOut) {
      try {
        timeTakenOut = new Date(dto.timeTakenOut);
        if (isNaN(timeTakenOut.getTime())) {
          throw new Error();
        }
      } catch {
        throw new BadRequestException('Invalid timeTakenOut format');
      }
    }

    const vagon = this.vagonRepo.create({
      number: dto.number,
      description: dto.description,
      type: dto.type,
      importedTime,
      timeTakenOut: dto.timeTakenOut ? new Date(dto.timeTakenOut) : undefined,
      vchd,
    });

    return this.vagonRepo.save(vagon);
  }

  async findAll(): Promise<Vagon[]> {
    return this.vagonRepo.find();
  }

  async findOne(id: string): Promise<Vagon> {
    const vagon = await this.vagonRepo.findOneBy({ id });
    if (!vagon) throw new NotFoundException('Vagon not found');
    return vagon;
  }

  async update(id: string, dto: UpdateVagonDto): Promise<Vagon> {
    const vagon = await this.findOne(id);
    if (dto.vchdId) {
      const vchd = await this.vchdRepo.findOneBy({ id: dto.vchdId });
      if (!vchd) throw new NotFoundException('VCHD not found');
      vagon.vchd = vchd;
    }

    Object.assign(vagon, dto);
    return this.vagonRepo.save(vagon);
  }

  async remove(id: string): Promise<void> {
    const vagon = await this.findOne(id);
    await this.vagonRepo.remove(vagon);
  }

}
