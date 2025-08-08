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
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { string } from 'joi';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles('superadmin')
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('superadmin')
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: string })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: string })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: string })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
