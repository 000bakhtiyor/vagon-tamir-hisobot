import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RepairClassification } from './entities/repair-classification.entity';
import { CreateRepairClassificationDto } from './dto/create-repair-classification.dto';
import { UpdateRepairClassificationDto } from './dto/update-repair-classification.dto';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { CreateRepairClassificationGroupDto } from './dto/create-rp-group.dto';
import { RepairClassificationGroup } from './entities/repair-classification-group.entity';

@Injectable()
export class RepairClassificationsService {
  constructor(
    @InjectRepository(RepairClassification)
    private readonly repo: Repository<RepairClassification>,
    @InjectRepository(RepairClassificationGroup)
    private readonly groupRepo: Repository<RepairClassificationGroup>,
  ) { }

  async createGroupWithRps(dto: CreateRepairClassificationGroupDto) {
    const group = this.groupRepo.create({ name: dto.name });

    if (dto.rpIds?.length > 0) {
      const rps = await this.repo.findBy({ id: In(dto.rpIds) });

      if (rps.length !== dto.rpIds.length) {
        throw new NotFoundException('Some RP IDs were not found');
      }

      group.classifications = rps;
    }

    await this.groupRepo.save(group);

    return this.groupRepo.findOne({
      where: { id: group.id },
      relations: ['classifications'],
    });
  }



  async findAllGroups(): Promise<BaseResponseDto<RepairClassificationGroup[]>> {
    const groups = await this.groupRepo.find({
      relations: ['classifications'],
    });
    return new BaseResponseDto(groups, 'Repair classification groups retrieved', 200);
  }
  
  async create(dto: CreateRepairClassificationDto): Promise<BaseResponseDto<RepairClassification>> {
    const existingClassification = await this.repo.findOneBy({
      code: dto.code
    })
    if(existingClassification){
      throw new ConflictException("Given code already registred")
    }
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return new BaseResponseDto(saved, 'Repair classification created', 201);
  }

  async findAll(code?: number, page: number=1, limit: number=10): Promise<BaseResponseDto<RepairClassification[]>> {
    const query = this.repo.createQueryBuilder('rc');

    if (code !== undefined) {
      query.where('CAST(rc.code AS TEXT) LIKE :code', { code: `%${code}%` });
    }

    query.skip((page - 1) * limit).take(limit);
    const list = await query.getMany();

    return new BaseResponseDto(list, 'Repair classifications retrieved', 200);
  }



  async findOne(id: string): Promise<BaseResponseDto<RepairClassification | null>> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      return new BaseResponseDto(null, `Repair classification with id ${id} not found`, 404);
    }
    return new BaseResponseDto(entity, 'Repair classification retrieved', 200);
  }

  async update(id: string, dto: UpdateRepairClassificationDto): Promise<BaseResponseDto<RepairClassification | null>> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return new BaseResponseDto(null, `Repair classification with id ${id} not found`, 404);
    }
    Object.assign(existing, dto);
    const updated = await this.repo.save(existing);
    return new BaseResponseDto(updated, 'Repair classification updated', 200);
  }

  async remove(id: string): Promise<BaseResponseDto<null>> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return new BaseResponseDto(null, `Repair classification with id ${id} not found`, 404);
    }
    await this.repo.remove(existing);
    return new BaseResponseDto(null, 'Repair classification deleted', 200);
  }
}
