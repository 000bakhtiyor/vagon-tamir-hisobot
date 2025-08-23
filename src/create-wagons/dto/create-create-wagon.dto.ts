import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class CreateWagonDto {
    @ApiProperty({ example: '12345', description: 'Wagon number' })
    @IsString()
    number: string;

    @ApiProperty({ example: '2025-08-20T10:15:00.000Z', description: 'Creation date in ISO format' })
    @IsDateString()
    createdAt: Date;

    @ApiProperty({ example: 'a3d6a5bb-8b3b-46e2-a40f-ec8f84cf3d4c', description: 'Depot ID (UUID)' })
    @IsString()
    wagonDepotId: string;
}
