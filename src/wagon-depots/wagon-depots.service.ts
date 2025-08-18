import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { WagonDepot } from './entities/wagon-depot.entity';
import { CreateWagonDepotDto } from './dto/create-wagon-depot.dto';
import { UpdateWagonDepotDto } from './dto/update-wagon-depot.dto';
import { User } from 'src/users/entities/user.entity';
import { BaseResponseDto } from 'src/common/types/base-response.dto';

@Injectable()
export class WagonDepotsService {
  constructor(
    @InjectRepository(WagonDepot)
    private readonly wagonDepotRepository: Repository<WagonDepot>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createWagonDepotDto: CreateWagonDepotDto): Promise<BaseResponseDto<WagonDepot>> {
    const existingDepot = await this.wagonDepotRepository.findOne({
      where: { name: createWagonDepotDto.name },
    });

    if (existingDepot) {
      return new BaseResponseDto<WagonDepot>(
        null,
        'Depot with this name already exists',
        400
      );
    }

    let owners: User[] = [];
    if (createWagonDepotDto.ownerIds?.length) {
      owners = await this.userRepository.findBy({
        id: In(createWagonDepotDto.ownerIds),
      });

      const foundIds = owners.map((o) => o.id);
      const missingIds = createWagonDepotDto.ownerIds.filter(
        (id) => !foundIds.includes(id),
      );

      if (missingIds.length > 0) {
        return new BaseResponseDto<WagonDepot>(
          null,
          `Owner(s) not found for ID(s): ${missingIds.join(', ')}`,
          404
        )
      }
    }


    const newDepot = this.wagonDepotRepository.create({
      name: createWagonDepotDto.name,
      admins: owners,
    });

    const savedDepot = await this.wagonDepotRepository.save(newDepot);

    return new BaseResponseDto<WagonDepot>(
      savedDepot,
      'Depot created successfully',
      201
    );
  }

  async findAll(page: number, limit: number): Promise<BaseResponseDto<WagonDepot[]>> {
    const depots = await this.wagonDepotRepository.find({
      relations: ['admins', 'stations'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return new BaseResponseDto<WagonDepot[]>(
      depots,
      'Depots retrieved successfully',
      200
    );
  }

  async findAllNames(): Promise<BaseResponseDto<WagonDepot[]>> {
    const depots = await this.wagonDepotRepository.find();
    return new BaseResponseDto<WagonDepot[]>(
      depots,
      'Depots retrieved successfully',
      200
    );
  }

  async findOne(id: string): Promise<BaseResponseDto<WagonDepot>> {
    const depot = await this.wagonDepotRepository.findOne({
      where: { id },
      relations: ['admins', 'stations'],
    });

    if (!depot) {
      return new BaseResponseDto<WagonDepot>(
        null,
        'Depot not found',
        404
      );
    }

    return new BaseResponseDto<WagonDepot>(
      depot,
      'Depot retrieved successfully',
      200
    );
  }

  async update(id: string, updateDto: UpdateWagonDepotDto): Promise<BaseResponseDto<WagonDepot>> {
    const depot = await this.wagonDepotRepository.findOne({ where: { id } });

    if (!depot) {
      return new BaseResponseDto<WagonDepot>(
        null,
        'Depot not found',
        404
      );
    }

    let owners: User[] = depot.admins || [];
    if (updateDto.ownerIds?.length) {
      owners = await this.userRepository.findBy({
        id: In(updateDto.ownerIds),
      });
    }

    Object.assign(depot, {
      name: updateDto.name ?? depot.name,
      admins: owners,
    });

    const updatedDepot = await this.wagonDepotRepository.save(depot);

    return new BaseResponseDto<WagonDepot>(
      updatedDepot,
      'Depot updated successfully',
      200
    );
  }

  async remove(id: string): Promise<BaseResponseDto<null>> {
    const result = await this.wagonDepotRepository.delete(id);

    if (result.affected === 0) {
      return new BaseResponseDto<null>(
        null,
        'Depot not found',
        404
      );
    }

    return new BaseResponseDto<null>(
      null,
      'Depot removed successfully',
      200
    );
  }
}
