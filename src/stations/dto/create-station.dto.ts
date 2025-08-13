import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStationDto {
    @ApiProperty({
        description: 'Name of the station',
        example: 'Chuqursoy',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'UUID of the related wagon depot',
        example: 'b19d1c6b-6727-4577-b22f-89e296fac021',
        format: 'uuid',
    })
    @IsNotEmpty()
    @IsUUID()
    wagonDepotId: string;
}
