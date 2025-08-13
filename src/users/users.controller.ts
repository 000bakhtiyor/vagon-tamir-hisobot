import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { string } from 'joi';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiTags('Users [SUPERADMIN, 1 All]')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @Roles(RolesEnum.VIEWER, RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get current user information [All]' })
  async getCurrentUser(@UserDecorator('userId') userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Post()
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: string })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: string })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: string })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
