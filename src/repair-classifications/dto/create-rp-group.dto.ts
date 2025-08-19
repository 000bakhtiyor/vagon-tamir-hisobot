import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateRepairClassificationGroupDto {
    @ApiProperty({ example: 'Vagon g‘ildirak bo‘yicha turgan vagon' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: [
            '550e8400-e29b-41d4-a716-446655440000',
            '550e8400-e29b-41d4-a716-446655440111'
        ],
        description: 'List of RP IDs to assign to this group',
        type: [String],
    })
    @IsArray()
    @IsUUID('all', { each: true })
    rpIds: string[];
}
