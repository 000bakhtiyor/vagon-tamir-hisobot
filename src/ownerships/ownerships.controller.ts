import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OwnershipsService } from './ownerships.service';
import { CreateOwnershipDto } from './dto/create-ownership.dto';
import { UpdateOwnershipDto } from './dto/update-ownership.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiTags('Ownerships [SUPERADMIN]')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ownerships')
export class OwnershipsController {
  constructor(private readonly ownershipsService: OwnershipsService) { }

  @Post()
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new ownership' })
  async create(@Body() createOwnershipDto: CreateOwnershipDto) {
    return this.ownershipsService.create(createOwnershipDto);
  }
  
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    type: Number,
  })
  @Get()
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.MODERATOR)
  @ApiOperation({ summary: 'Get all ownerships' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.ownershipsService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.MODERATOR)
  @ApiOperation({ summary: 'Get a single ownership by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Ownership ID (UUID)' })
  async findOne(@Param('id') id: string) {
    return this.ownershipsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update an ownership by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Ownership ID (UUID)' })
  async update(
    @Param('id') id: string,
    @Body() updateOwnershipDto: UpdateOwnershipDto
  ) {
    return this.ownershipsService.update(id, updateOwnershipDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete an ownership by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Ownership ID (UUID)' })
  async remove(@Param('id') id: string) {
    return this.ownershipsService.remove(id);
  }
}
