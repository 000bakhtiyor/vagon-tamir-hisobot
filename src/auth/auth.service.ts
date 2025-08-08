import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RegisterDto } from './dto/register.dto';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, 
  ){}

  async generateTokens(userId: string, username: string, role: string, vchdId?: string): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { sub: userId, username, role, vchdId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { accessToken, refreshToken };
  }

  async hashRefreshToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }

  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.username, user.role, user.vchdId);

    await this.usersService.updateRefreshToken(user.id, await this.hashRefreshToken(refreshToken));

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      vchdId: user.vchdId,
    };
  }

  async register(registerDto: RegisterDto): Promise<ResponseLoginDto> {
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new UnauthorizedException(`Username "${registerDto.username}" is already taken.`);
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role as 'admin' | 'viewer' | 'superadmin',
    });

    if(!newUser.vchdId){
      throw new NotFoundException('VCHD ID not found for this user');
    }
    const { accessToken, refreshToken } = await this.generateTokens(newUser.id, newUser.username, newUser.role, newUser.vchdId);

    await this.usersService.updateRefreshToken(newUser.id, await this.hashRefreshToken(refreshToken));

    return {
      accessToken,
      refreshToken,
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
      fullName: newUser.fullName,
      vchdId: newUser.vchdId,
    };
  }

  async refreshTokens(refreshToken: string): Promise<ResponseLoginDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) throw new ForbiddenException('Invalid refresh token');
      if(!user.vchdId){
        throw new NotFoundException('VCHD ID not found for this user');
      } 
      const tokens = await this.generateTokens(user.id, user.username, user.role, user.vchdId);
      await this.usersService.updateRefreshToken(user.id, await this.hashRefreshToken(tokens.refreshToken));

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
        username: user.username,
        role: user.role,
      };
    } catch (e) {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }

  async logout(userId: string): Promise<void> {
    if (!userId || userId.trim() === '' || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required for logout');
    }
    await this.usersService.updateRefreshToken(userId, ""); 
  }

}
