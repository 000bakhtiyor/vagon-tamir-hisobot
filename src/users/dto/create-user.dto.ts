import { IsOptional, IsString, MinLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

    @ApiPropertyOptional({ example: 'viewer', enum: ['admin', 'viewer'] })
    @IsOptional()
    @IsIn(['admin', 'viewer', 'superadmin'], { message: 'Role must be admin, superadmin or viewer' })
    role: 'admin' | 'viewer' | 'superadmin';

    @ApiPropertyOptional({ example: 'vchd12345' })
    @IsOptional()
    @IsString()
    vchdId?: string;
}
