import { ApiProperty } from '@nestjs/swagger';

export class ResponseLoginDto {
    @ApiProperty({
        description: 'Access token used for authenticated requests',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Refresh token used to get a new access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken: string;

    @ApiProperty({
        description: 'User ID',
        example: 1,
    })
    userId: string;

    @ApiProperty({
        description: 'Username of the logged in user',
        example: 'john_doe',
    })
    username: string;

    @ApiProperty({
        description: 'Role or permissions (optional)',
        example: 'admin',
    })
    role: string;

    @ApiProperty({
        description: 'Optional full name of the user',
        example: 'John Doe',
        required: false,
    })
    fullName?: string;  
    
    @ApiProperty({
        description: 'Optional VCHD ID associated with the user',
        example: 'vchd12345',
        required: false,
    })
    depoId?: string;
}
