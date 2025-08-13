import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsArray,
    ArrayUnique,
    IsUUID,
    IsOptional
} from 'class-validator';

export class CreateWagonDepotDto {
    @ApiProperty({
        description: 'The name of the wagon depot',
        example: 'Qarshi'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'List of owner IDs (UUID format)',
        type: [String],
        example: [
            '8e8f4a15-88a2-4a40-b94a-2c0123d0e567',
            '91f2aa3b-0c58-4f74-9f71-08d9d54688f1'
        ]
    })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    ownerIds?: string[];
}
