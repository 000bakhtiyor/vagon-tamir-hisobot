import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
            throw new NotFoundException('Wagon not found or not in Release state')
        }

        const importedDate = importWagonDto.importedDate ?? new Date();
        if (existingWagon.releaseDate && importedDate <= existingWagon.releaseDate) {
            throw new BadRequestException('Imported date must be later than release date');
        }

        if (existingWagon.takenOutDate !== null) {
            throw new ConflictException('Wagon already taken out, cannot import')
        }

        Object.assign(existingWagon, {
            operation: OperationType.Import,
            importedDate,
        });

        const updatedWagon = await this.wagonRepository.save(existingWagon);

        return new BaseResponseDto(updatedWagon, 'Wagon successfully imported', 200);
    }


}
