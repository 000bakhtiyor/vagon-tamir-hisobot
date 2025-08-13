import { Injectable } from '@nestjs/common';
import { OperationType } from 'src/common/enums/operation-type.enum';
import { ImportWagonDto } from './dto/import.dto';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImportVagonsService {

    constructor(
        @InjectRepository(ReleasedVagon)
        private readonly wagonRepository: Repository<ReleasedVagon>
    ) { }

    async importWagon(importWagonDto: ImportWagonDto): Promise<BaseResponseDto<any>> {
        const existingWagon = await this.wagonRepository.findOne({
            where: { id: importWagonDto.wagonId, operation: OperationType.Release },
        });

        if (!existingWagon) {
            return new BaseResponseDto(
                null,
                'Wagon not found or not in Release state',
                404
            );
        }

        Object.assign(existingWagon, {
            operation: OperationType.Import,
            importedDate: importWagonDto.importedDate ?? new Date()
        });

        const updatedWagon = await this.wagonRepository.save(existingWagon);

        return new BaseResponseDto(
            updatedWagon,
            'Wagon successfully imported',
            200
        );
    }

}
