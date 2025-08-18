import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RegisterDto } from './dto/register.dto';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { RolesEnum } from 'src/common/enums/role.enum';
import { Roles } from './roles.decorator';
@Injectable()
export class AuthService {
  
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WagonDepot)
    private readonly depoRepository: Repository<WagonDepot>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, 
  ){}

  async generateTokens(userId: string, username: string, role: string, depoId: string): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { sub: userId, username, role, depoId };

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
    const user = await this.userRepository.findOneBy({ username: loginDto.username });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    let usersDepo: any;
    if(user.role === RolesEnum.MODERATOR){
      usersDepo = await this.depoRepository.findOneBy({
        admins: { id: user.id }
      })
      if (!usersDepo) {
        throw new UnauthorizedException('Depo not found with given user id');
      }
    }
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.username, user.role, usersDepo?.id || null);

    await this.usersService.updateRefreshToken(user.id, await this.hashRefreshToken(refreshToken));

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      depoId: usersDepo?.id || null
    };
  }

  async register(registerDto: RegisterDto): Promise<ResponseLoginDto> {
    const existingUser = await this.userRepository.findOneBy({ username: registerDto.username })
    if (existingUser) {
      throw new UnauthorizedException(`Username "${registerDto.username}" is already taken.`);
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    if(!registerDto.role || !Object.values(RolesEnum).includes(registerDto.role as RolesEnum)) {
      throw new UnauthorizedException('Role is required and must be a valid enum value');
    }
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role as RolesEnum,
    });

    let usersDepo: any;

    if (registerDto.role === RolesEnum.MODERATOR) {
      usersDepo = await this.depoRepository.findOne({
        where: { id: registerDto.depoId },
        relations: ['admins'],
      });

      if (!usersDepo) {
        throw new UnauthorizedException('Depo not found with given id');
      }
      usersDepo.admins = [...(usersDepo.admins || []), newUser];
      
      await this.depoRepository.save(usersDepo);
    }

    const { accessToken, refreshToken } = await this.generateTokens(newUser.id, newUser.username, newUser.role, usersDepo?.id || null);

    await this.usersService.updateRefreshToken(newUser.id, await this.hashRefreshToken(refreshToken));

    return {
      accessToken,
      refreshToken,
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
      fullName: newUser.fullName,
      depoId: usersDepo?.id || null
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

      const usersDepo = await this.depoRepository.findOneBy({
        admins: { id: user.id }
      })
      if (!usersDepo) {
        throw new UnauthorizedException('Depo not found with given user id');
      }
      const tokens = await this.generateTokens(user.id, user.username, user.role, usersDepo.id);
      await this.usersService.updateRefreshToken(user.id, await this.hashRefreshToken(tokens.refreshToken));

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
        username: user.username,
        role: user.role,
        depoId: usersDepo.id
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
