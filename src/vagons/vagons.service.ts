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



  async create(dto: CreateVagonDto, vchdId?: string, role?: string): Promise<Vagon> {
    let vchd: Vchd;
    if(role === 'superadmin'){ ///keyinro to'g'irlanadi
      throw new BadRequestException('Superadmin cannot create vagons directly. Please use admin role.');
    }
    if (!vchdId) {
      throw new BadRequestException('VCHD ID is required');
    }

    try {
      vchd = await this.vchdRepo.findOneByOrFail({ id: vchdId });
    } catch (error) {
      throw new NotFoundException(`VCHD not found with id: ${vchdId}`);
    }
    
    const existingVagon = await this.vagonRepo.findOneBy({ number: dto.number });
    if (existingVagon) {
      throw new BadRequestException(`Vagon with number ${dto.number} already exists`);
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

  async findAll(vchdId: string): Promise<Vagon[]> {
    return this.vagonRepo.find({
      where: { vchd: { id: vchdId } },
      order: { importedTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vagon> {
    const vagon = await this.vagonRepo.findOneBy({ id });
    if (!vagon) throw new NotFoundException('Vagon not found');
    return vagon;
  }

  async update(id: string, dto: UpdateVagonDto, vchdId: string, role: string): Promise<Vagon> {
    if(role === 'superadmin') {
      throw new BadRequestException('Superadmin cannot update vagons directly. Please use admin role.');
    }
    const vagon = await this.findOne(id);
    if (vchdId) {
      const vchd = await this.vchdRepo.findOneBy({ id: vchdId });
      if (!vchd) throw new NotFoundException('VCHD not found');
      vagon.vchd = vchd;
    }

    Object.assign(vagon, dto);
    return this.vagonRepo.save(vagon);
  }

  async remove(id: string, vchdId: string, role:string): Promise<void> {
    if(role === 'superadmin') {
      throw new BadRequestException('Superadmin cannot delete vagons directly. Please use admin role.');
    }
    const vagon = await this.findOne(id);
    if (vagon.vchd.id !== vchdId) {
      throw new BadRequestException('Vagon does not belong to the specified VCHD');
    }
    if (!vagon) throw new NotFoundException('Vagon not found');
    await this.vagonRepo.remove(vagon);
  }

}
