import { Injectable } from '@nestjs/common';
import { CreateOwnershipDto } from './dto/create-ownership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ownership } from './entities/ownership.entity';
import { Repository } from 'typeorm';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { UpdateOwnershipDto } from './dto/update-ownership.dto';

@Injectable()
export class OwnershipsService {

  constructor(
    @InjectRepository(Ownership) private ownershipRepository: Repository<Ownership>,
  ) {}
  async create(createOwnershipDto: CreateOwnershipDto): Promise<BaseResponseDto<Ownership>> {
    const exportedOwnership = await this.ownershipRepository.findOne({
      where: { ownershipName: createOwnershipDto.ownershipName },
    });
    if (exportedOwnership) {
      return new BaseResponseDto<Ownership>(
        new Ownership(),
        'Ownership with this name already exists',
        400
      );
    }
    const ownership = await this.ownershipRepository.create(createOwnershipDto);
    await this.ownershipRepository.save(ownership);
    return new BaseResponseDto<Ownership>(
      ownership,
      'Ownership created successfully',
      201
    );
  }

  async findAll(page:number, limit:number): Promise<BaseResponseDto<Ownership[]>> {
    const ownerships = await this.ownershipRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return new BaseResponseDto<Ownership[]>(
      ownerships,
      'Ownership list retrieved successfully',
      200
    );
  }

  async findOne(id: string): Promise<BaseResponseDto<Ownership>> {
    const ownership = await this.ownershipRepository.findOne({ where: { id } });

    if (!ownership) {
      return new BaseResponseDto<Ownership>(
        null,
        'Ownership not found',
        404
      );
    }

    return new BaseResponseDto<Ownership>(
      ownership,
      'Ownership retrieved successfully',
      200
    );
  }


  async update(id: string, updateOwnershipDto: UpdateOwnershipDto): Promise<BaseResponseDto<Ownership>> {
    const ownership = await this.ownershipRepository.findOne({ where: { id } });

    if (!ownership) {
      return new BaseResponseDto<Ownership>(
        null,
        'Ownership not found',
        404
      );
    }

    Object.assign(ownership, updateOwnershipDto);
    const updatedOwnership = await this.ownershipRepository.save(ownership);

    return new BaseResponseDto<Ownership>(
      updatedOwnership,
      'Ownership updated successfully',
      200
    );
  }

  async remove(id: string): Promise<BaseResponseDto<null>> {
    const ownership = await this.ownershipRepository.findOne({ where: { id } });

    if (!ownership) {
      return new BaseResponseDto<null>(
        null,
        'Ownership not found',
        404
      );
    }

    await this.ownershipRepository.remove(ownership);

    return new BaseResponseDto<null>(
      null,
      'Ownership deleted successfully',
      200
    );
  }

}
