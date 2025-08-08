import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    role?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    vchdId?: string;
}
