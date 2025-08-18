import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { RolesEnum } from 'src/common/enums/role.enum';

export class RegisterDto {
    @ApiProperty()
    @IsString()
    @Matches(/^[A-Za-z][A-Za-z0-9_]*$/, {
        message: 'Username must start with a letter and contain only letters, numbers, or underscores',
    })
    username: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;

    @ApiProperty()
    @IsEnum(RolesEnum, { message: 'Role must be a valid enum value' })
    role: RolesEnum;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    depoId?: string;
}
