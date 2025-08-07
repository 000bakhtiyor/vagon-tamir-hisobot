import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class VchdNameDto {
    @ApiProperty()
    @IsString()
    uz: string;

    @ApiProperty()
    @IsString()
    eng: string;

    @ApiProperty()
    @IsString()
    ru: string;

    @ApiProperty()
    @IsString()
    krill: string;
}

export class CreateVchdDto {
    @ValidateNested()
    @Type(() => VchdNameDto)
    name: VchdNameDto;
}
