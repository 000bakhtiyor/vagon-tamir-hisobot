// src/vagons/dto/create-vagon.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class CreateVagonDto {
    @ApiProperty({
        example: '12345',
        description: 'Vagon number (must be unique)',
    })
    @IsString()
    @IsNotEmpty()
    number: string;

    @ApiPropertyOptional({
        example: 'Cargo wagon',
        description: 'Optional description about the vagon',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        example: 'platform',
        description: 'Type of vagon (e.g., platform, tank, etc.)',
    })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiPropertyOptional({
        example: '2025-08-01T00:00:00.000Z',
        description: 'Time when the vagon was imported. Defaults to now if not provided.',
    })
    @IsDateString()
    @IsOptional()
    importedTime?: Date;

    @ApiPropertyOptional({
        example: '2025-08-10T00:00:00.000Z',
        description: 'Optional time when the vagon was taken out',
    })
    @IsDateString()
    @IsOptional()
    timeTakenOut?: Date;

    @ApiProperty({
        example: '8a89c0ec-ff92-4f9e-8c62-dfbb18e0e641',
        description: 'The ID of the VCHD this vagon belongs to',
    })
    @IsUUID()
    @IsNotEmpty()
    vchdId: string;
}
