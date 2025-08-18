import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
      throw new ConflictException('Vagon number cannot be negative')
    }

    if (createReleasedVagonDto.repairClassificationId == "") {
      throw new BadRequestException('repairClassificationId must be have')
    }

    const existingOwnerShip = await this.ownershipRepository.findOneBy({
      id: createReleasedVagonDto.ownershipId
    });
    if (!existingOwnerShip) {
      throw new NotFoundException('Ownership not found')
    }

    const existingClassification = await this.repairClassificationRepository.findOneBy({
      id: createReleasedVagonDto.repairClassificationId
    });
    if (!existingClassification) {
      throw new NotFoundException('Repair classification not found')
    }

    const existingVagon = await this.releasedVagonsRepository.findOne({
      where: { vagonNumber: createReleasedVagonDto.vagonNumber },
    });
    if (existingVagon) {
      throw new ConflictException('Released vagon with this number already exists')
    }

    let whereCondition: any;

    if (role === RolesEnum.MODERATOR) {
      whereCondition = { id: createReleasedVagonDto.stationId ,wagonDepot: { id: depoId } };
    } else if (role === RolesEnum.SUPERADMIN){
      whereCondition = { id: createReleasedVagonDto.stationId };
    }

    const existingStation = await this.stationRepository.findOne({ where: whereCondition });

    if (!existingStation) {
      throw new NotFoundException('No station found')
    }



    const newVagon = this.releasedVagonsRepository.create({
      ...createReleasedVagonDto,
      releaseDate: createReleasedVagonDto.releaseDate ?? new Date(),
      importedDate: createReleasedVagonDto.importedDate,
      takenOutDate: createReleasedVagonDto.takenOutDate,
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
    depoId: string,
    page: number = 1,
    limit: number = 10,
    wagonCode?: string,
    wagonNumber?: string,
    vagonType?: string,
    releaseDate?: string,
    ownerType?: string,
    repairClassificationId?: string,
    ownershipId?: string,
    stationId?: string,
    importedDate?: string,
    takenOutDate?: string,
  ): Promise<BaseResponseDto<ReleasedVagon[]>> {
    const qb = this.releasedVagonsRepository.createQueryBuilder('v')
      .leftJoinAndSelect('v.station', 'station')
      .leftJoinAndSelect('station.wagonDepot', 'depot')
      .leftJoinAndSelect('v.repairClassification', 'repairClassification')
      .leftJoinAndSelect('v.ownership', 'ownership')
      .orderBy('v.releaseDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (role === RolesEnum.MODERATOR) {
      qb.andWhere('depot.id = :depoId', { depoId });
    }

    if (wagonCode) {
      qb.andWhere('v.wagonCode ILIKE :wagonCode', { wagonCode: `%${wagonCode}%` });
    }
    if (wagonNumber !== undefined) {
      qb.andWhere('CAST(v.wagonNumber AS TEXT) ILIKE :wagonNumber', {
        wagonNumber: `%${wagonNumber.toString()}%`
      });
    }
    if (vagonType) {
      qb.andWhere('v.vagonType = :vagonType', { vagonType });
    }
    if (releaseDate) {
      qb.andWhere('DATE(v.releaseDate) = :releaseDate', { releaseDate });
    }
    if (ownerType) {
      qb.andWhere('v.ownerType = :ownerType', { ownerType });
    }
    if (repairClassificationId) {
      qb.andWhere('repairClassification.id = :repairClassificationId', { repairClassificationId });
    }
    if (ownershipId) {
      qb.andWhere('ownership.id = :ownershipId', { ownershipId });
    }
    if (stationId) {
      qb.andWhere('station.id = :stationId', { stationId });
    }
    if (importedDate) {
      qb.andWhere('DATE(v.importedDate) = :importedDate', { importedDate });
    }
    if (takenOutDate) {
      qb.andWhere('DATE(v.takenOutDate) = :takenOutDate', { takenOutDate });
    }

    const vagons = await qb.getMany();

    return new BaseResponseDto<ReleasedVagon[]>(
      vagons,
      'Released vagons retrieved successfully',
      200,
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
    if (!vagon) throw new NotFoundException('Vagon not found')

    const existingVagon = await this.releasedVagonsRepository.existsBy({ vagonNumber: updateReleasedVagonDto.vagonNumber })
    if(existingVagon){
      throw new BadRequestException('Vagon number already exists')
    }

    const op = updateReleasedVagonDto.operation;

    if (op === OperationType.Import) {
      Object.assign(vagon, { ...updateReleasedVagonDto, importedDate: updateReleasedVagonDto.importedDate ?? new Date(), });
    } else if (op === OperationType.TakeOut) {
      Object.assign(vagon, { ...updateReleasedVagonDto, takenOutDate: updateReleasedVagonDto.takenOutDate ?? new Date(), });
    } else if (op === OperationType.Release) {
      Object.assign(vagon, { ...updateReleasedVagonDto });
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
