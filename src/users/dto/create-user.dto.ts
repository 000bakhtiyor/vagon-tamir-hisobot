import { IsOptional, IsString, MinLength, IsIn, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RolesEnum } from 'src/common/enums/role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'john_doe' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({
        example: RolesEnum.VIEWER,
        enum: RolesEnum,
        description: 'User role'
    })
    @IsOptional()
    @IsEnum(RolesEnum, { message: 'Role must be moderator, superadmin or viewer' })
    role?: RolesEnum;

}
