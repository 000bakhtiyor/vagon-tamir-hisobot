import { Injectable } from '@nestjs/common';
import { CreateReleasedVagonDto } from './dto/create-released-vagon.dto';
import { UpdateReleasedVagonDto } from './dto/update-released-vagon.dto';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { ReleasedVagon } from './entities/released-vagon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ownership } from 'src/ownerships/entities/ownership.entity';
import { OperationType } from 'src/common/enums/operation-type.enum';
import { RepairClassification } from 'src/repair-classifications/entities/repair-classification.entity';
import { Station } from 'src/stations/entities/station.entity';
import { RolesEnum } from 'src/common/enums/role.enum';

@Injectable()
export class ReleasedVagonsService {
  constructor(
    @InjectRepository(ReleasedVagon)
    private readonly releasedVagonsRepository: Repository<ReleasedVagon>,
    @InjectRepository(Ownership)
    private readonly ownershipRepository: Repository<Ownership>,
    @InjectRepository(RepairClassification)
    private readonly repairClassificationRepository: Repository<RepairClassification>,
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>
  ) {}
  async create(createReleasedVagonDto: CreateReleasedVagonDto, role: RolesEnum, depoId: string): Promise<BaseResponseDto<ReleasedVagon>> {

    if (createReleasedVagonDto.vagonNumber < 0) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Vagon number cannot be negative',
        400
      );
    }

    if (createReleasedVagonDto.repairClassificationId == "") {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'repairClassificationId must be have',
        400
      );
    }

    const existingOwnerShip = await this.ownershipRepository.findOneBy({
      id: createReleasedVagonDto.ownershipId
    });
    if (!existingOwnerShip) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Ownership not found',
        400
      );
    }

    const existingClassification = await this.repairClassificationRepository.findOneBy({
      id: createReleasedVagonDto.repairClassificationId
    });
    if (!existingClassification) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Repair classification not found',
        400
      );
    }

    const existingVagon = await this.releasedVagonsRepository.findOne({
      where: { vagonNumber: createReleasedVagonDto.vagonNumber },
    });
    if (existingVagon) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Released vagon with this number already exists',
        400
      );
    }

    let whereCondition: any;

    if (role === RolesEnum.MODERATOR) {
      whereCondition = { id: createReleasedVagonDto.stationId ,wagonDepot: { id: depoId } };
    } else if (role === RolesEnum.SUPERADMIN){
      whereCondition = { id: createReleasedVagonDto.stationId };
    }

    const existingStation = await this.stationRepository.findOne({ where: whereCondition });

    if (!existingStation) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'No station found',
        400
      );
    }



    const newVagon = this.releasedVagonsRepository.create({
      ...createReleasedVagonDto,
      releaseDate: createReleasedVagonDto.releaseDate ?? new Date(),
      importedDate: createReleasedVagonDto.importedDate ?? new Date(),
      takenOutDate: createReleasedVagonDto.takenOutDate ?? new Date(),
      station: existingStation,
      repairClassification: existingClassification,
      ownership: existingOwnerShip,
    });

    await this.releasedVagonsRepository.save(newVagon);

    return new BaseResponseDto<ReleasedVagon>(
      newVagon,
      'Released vagon created successfully',
      201
    );
  }


  async findAll(
    role: RolesEnum,
    depoId: string
  ): Promise<BaseResponseDto<ReleasedVagon[]>> {
    const whereCondition =
      role === RolesEnum.MODERATOR
        ? { station: { wagonDepot: { id: depoId } } }
        : {};

    const vagons = await this.releasedVagonsRepository.find({
      where: whereCondition,
      relations: ['station', 'station.wagonDepot', 'repairClassification', 'ownership'],
    });

    return new BaseResponseDto<ReleasedVagon[]>(
      vagons,
      'Released vagons retrieved successfully',
      200
    );
  }


  async findOne(id: string): Promise<BaseResponseDto<ReleasedVagon>> {
    const vagon = await this.releasedVagonsRepository.findOne({
      where: { id },
      relations: ['station', 'repairClassification'],
    });

    if (!vagon) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Released vagon not found',
        404
      );
    }

    return new BaseResponseDto<ReleasedVagon>(
      vagon,
      'Released vagon retrieved successfully',
      200
    );
  }

  async update(
    id: string,
    updateReleasedVagonDto: UpdateReleasedVagonDto
  ): Promise<BaseResponseDto<ReleasedVagon>> {
    const vagon = await this.releasedVagonsRepository.findOne({ where: { id } });
    if (!vagon) {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Released vagon not found',
        404
      );
    }

    const op = updateReleasedVagonDto.operation;

    if (op === OperationType.Import) {
      Object.assign(vagon, { ...updateReleasedVagonDto, importedDate: updateReleasedVagonDto.importedDate ?? new Date(), });
    } else if (op === OperationType.TakeOut) {
      Object.assign(vagon, { ...updateReleasedVagonDto, takenOutDate: updateReleasedVagonDto.takenOutDate ?? new Date(), });
    } else if (op === OperationType.Release) {
      Object.assign(vagon, { ...updateReleasedVagonDto });
    } else {
      return new BaseResponseDto<ReleasedVagon>(
        null,
        'Invalid operation type',
        400
      );
    }

    await this.releasedVagonsRepository.save(vagon);

    return new BaseResponseDto<ReleasedVagon>(
      vagon,
      'Released vagon updated successfully',
      200
    );
  }


  async remove(id: string): Promise<BaseResponseDto<null>> {
    const vagon = await this.releasedVagonsRepository.findOne({ where: { id } });

    if (!vagon) {
      return new BaseResponseDto<null>(
        null,
        'Released vagon not found',
        404
      );
    }

    await this.releasedVagonsRepository.remove(vagon);

    return new BaseResponseDto<null>(
      null,
      'Released vagon deleted successfully',
      200
    );
  }

}
