import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsISO8601,
    IsEnum,
    IsOptional,
    IsString,
    IsNumber,
    IsNotEmpty,
    IsDate,
} from 'class-validator';
import { LoadStatus } from 'src/common/enums/load-status.enum';
import { OperationType } from 'src/common/enums/operation-type.enum';
import { WagonRepairType } from 'src/common/enums/repair-type.enum';
import { WagonType } from 'src/common/enums/wagom-type.enum';
import { VagonOwnerType } from 'src/common/enums/wagon-owner-type.enum';

export class CreateReleasedVagonDto {
    @ApiProperty({ description: 'Vagon number', example: 123456 })
    @IsNumber()
    vagonNumber: number;

    @ApiPropertyOptional({ description: 'Optional vagon code', example: 'VG-9087' })
    @IsString()
    @IsOptional()
    vagonCode?: string;

    @ApiProperty({
        enum: WagonType,
        description: 'Type of vagon',
        example: WagonType.KR,
    })
    @IsEnum(WagonType, {
        message: `vagonType must be one of: ${Object.values(WagonType).join(', ')}`,
    })
    vagonType: WagonType;

    @ApiProperty({
        description: 'Ownership ID of the vagon',
        example: '7a0c5451-529a-4de4-a7f5-ccf91a6cda31',
    })
    @IsString()
    @IsNotEmpty()
    ownershipId: string;

    @ApiProperty({
        enum: VagonOwnerType,
        description: 'Type of vagon owner',
        example: VagonOwnerType.PRIVATE,
    })
    @IsEnum(VagonOwnerType, {
        message: `ownerType must be one of: ${Object.values(VagonOwnerType).join(', ')}`,
    })
    ownerType: VagonOwnerType;

    @ApiProperty({
        enum: OperationType,
        description: 'Operation type',
        example: OperationType.Release,
    })
    @IsEnum(OperationType, {
        message: `operation must be one of: ${Object.values(OperationType).join(', ')}`,
    })
    operation: OperationType;

    @ApiProperty({
        description: 'The date the item was released',
        type: String,
        format: 'date',
        example: '2025-08-13',
    })
    @IsDate()
    releaseDate: Date;

    @ApiProperty({
        description: 'The date when the vagon was imported.',
        type: String,
        format: 'date',
        example: '2025-08-13',
        required: false, 
    })
    @IsOptional()
    @IsDate()
    importedDate?: Date;

    @ApiProperty({
        description: 'The date when the vagon was taken out.',
        type: String,
        format: 'date',
        example: '2025-08-15',
        required: false,
    })
    @IsOptional()
    @IsDate()
    takenOutDate?: Date;

    @ApiProperty({
        description: 'Repair classification ID',
        example: '1e2d73d4-6156-4a6f-9a43-fbfa6a3f9dcb',
    })
    @IsString()
    @IsNotEmpty()
    repairClassificationId: string;

    @ApiProperty({
        enum: WagonRepairType,
        description: 'Type of wagon repair',
        example: WagonRepairType.CURRENT,
    })
    @IsEnum(WagonRepairType, {
        message: `repairType must be one of: ${Object.values(WagonRepairType).join(', ')}`,
    })
    repairType: WagonRepairType;

    @ApiPropertyOptional({
        description: 'Whether a transit permit exists',
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    transitPermit?: boolean;

    @ApiProperty({
        enum: LoadStatus,
        description: 'Load status of the vagon',
        example: LoadStatus.LOADED,
    })
    @IsEnum(LoadStatus, {
        message: `loadStatus must be one of: ${Object.values(LoadStatus).join(', ')}`,
    })
    loadStatus: LoadStatus;

    @ApiProperty({
        description: 'Station ID where the vagon is located',
        example: 'b876f4fa-209b-4b5e-9c5e-cd11291ffdd3',
    })
    @IsString()
    @IsNotEmpty()
    stationId: string;
}
