import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairClassification } from './entities/repair-classification.entity';
import { CreateRepairClassificationDto } from './dto/create-repair-classification.dto';
import { UpdateRepairClassificationDto } from './dto/update-repair-classification.dto';
import { BaseResponseDto } from 'src/common/types/base-response.dto';

@Injectable()
export class RepairClassificationsService {
  constructor(
    @InjectRepository(RepairClassification)
    private readonly repo: Repository<RepairClassification>,
  ) { }

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

  async findAll(code?: number): Promise<BaseResponseDto<RepairClassification[]>> {
    const query = this.repo.createQueryBuilder('rc');

    if (code !== undefined) {
      query.where('CAST(rc.code AS TEXT) LIKE :code', { code: `%${code}%` });
    }

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
