import { Injectable } from '@nestjs/common';
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
    async takeOutWagon(takenOutWagonDto: TakenOutWagonDto): Promise<BaseResponseDto<any>> {
            const existingWagon = await this.wagonRepository.findOne({
                where: { id: takenOutWagonDto.wagonId, operation: OperationType.Import },
            });
    
            if (!existingWagon) {
                return new BaseResponseDto(
                    null,
                    'Wagon not found or not in Import state',
                    404
                );
            }
    
            Object.assign(existingWagon, {
                operation: OperationType.TakeOut,
                takenOutDate: takenOutWagonDto.takenOutDate ?? new Date()
            });
    
            const updatedWagon = await this.wagonRepository.save(existingWagon);
    
            return new BaseResponseDto(
                updatedWagon,
                'Wagon successfully imported',
                200
            );
        }
}
