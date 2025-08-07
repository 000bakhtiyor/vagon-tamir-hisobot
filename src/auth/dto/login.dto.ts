// src/auth/dto/login.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'securePassword123', description: 'User password' })
    @IsString()
    password: string;
}
