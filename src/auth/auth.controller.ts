import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login and token generation' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Returns access and refresh tokens',
    type: ResponseLoginDto,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: ResponseLoginDto })
  async register(@Body() registerDto: RegisterDto): Promise<ResponseLoginDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rotate access and refresh tokens' })
  @ApiResponse({ status: 200, type: ResponseLoginDto })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto ): Promise<ResponseLoginDto> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and remove refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async logout(@Req() req: any): Promise<void> {
    const userId = req.user.userId;
    console.log(userId)
    await this.authService.logout(userId);
  }

}
