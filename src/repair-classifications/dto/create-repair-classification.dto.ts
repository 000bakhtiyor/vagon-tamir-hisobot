import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRepairClassificationDto {
    @ApiProperty({
        description: 'The unique code for the repair classification',
        example: 101,
    })
    @IsNumber()
    code: number;

    @ApiProperty({
        description: 'The classification group code',
        example: 5,
    })
    @IsNumber()
    classificationCode: number;

    @ApiProperty({
        description: 'A short description of the repair classification',
        example: 'Brake system repair',
    })
    @IsString()
    shortDescription: string;

    @ApiProperty({
        description: 'Detailed explanation of the repair classification',
        example: 'Repairs related to the braking mechanisms, including pad replacement and system checks.',
    })
    @IsString()
    text: string;
}
