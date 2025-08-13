import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { RepairClassificationsService } from './repair-classifications.service';
import { CreateRepairClassificationDto } from './dto/create-repair-classification.dto';
import { UpdateRepairClassificationDto } from './dto/update-repair-classification.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiTags('Repair Classifications [superadmin]')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('repair-classifications')
export class RepairClassificationsController {
  constructor(private readonly service: RepairClassificationsService) { }

  @Post()
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new repair classification' })
  async create(@Body() dto: CreateRepairClassificationDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.MODERATOR)
  @ApiOperation({ summary: 'Get all repair classifications' })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Optional code to filter repair classifications',
    type: Number,
  })
  async findAll(
    @Query('code') code?: number 
  ) {
    return this.service.findAll(code);
  }


  @Get(':id')
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.MODERATOR)
  @ApiOperation({ summary: 'Get repair classification by ID' })
  @ApiParam({ name: 'id', description: 'Repair Classification UUID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update repair classification' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRepairClassificationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete repair classification' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
