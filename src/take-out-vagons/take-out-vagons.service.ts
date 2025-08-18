import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { TakenOutWagonDto } from './dto/taken-out.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationType } from 'src/common/enums/operation-type.enum';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TakeOutVagonsService {
    
    constructor(
        @InjectRepository(ReleasedVagon)
        private readonly wagonRepository: Repository<ReleasedVagon>
    ) { }
    async takeOutWagon(
        takenOutWagonDto: TakenOutWagonDto
    ): Promise<BaseResponseDto<any>> {
        const existingWagon = await this.wagonRepository.findOne({
            where: { id: takenOutWagonDto.wagonId, operation: OperationType.Import },
        });

        if (!existingWagon) {
            throw new NotFoundException('Wagon not found or not in Import state');
        }

        const takenOutDate = takenOutWagonDto.takenOutDate ?? new Date();
        if (existingWagon.importedDate && takenOutDate <= existingWagon.importedDate) {
            throw new BadRequestException('Taken out date must be later than imported date');
        }

        if (existingWagon.takenOutDate !== null) {
            throw new ConflictException('Wagon already taken out, cannot take out again');
        }

        Object.assign(existingWagon, {
            operation: OperationType.TakeOut,
            takenOutDate,
        });

        const updatedWagon = await this.wagonRepository.save(existingWagon);

        return new BaseResponseDto(
            updatedWagon,
            'Wagon successfully taken out',
            200,
        );
    }

}
