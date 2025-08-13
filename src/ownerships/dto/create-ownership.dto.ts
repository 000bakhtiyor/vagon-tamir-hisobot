import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOwnershipDto {
    @ApiProperty({
        description: 'The name of the ownership entity',
        example: "OOO 'COTTON LOGISTICS'",
    })
    @IsString()
    @IsNotEmpty()
    ownershipName: string;
}

