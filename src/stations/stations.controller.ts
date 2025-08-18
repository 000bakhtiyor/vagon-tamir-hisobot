import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { UserDecorator } from 'src/common/decorators/user.decorator';

@ApiTags('Stations [superadmin]')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stations')
export class StationsController {
  constructor(private readonly stationService: StationsService) { }

  @Post()
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.MODERATOR)
  @ApiOperation({ summary: 'Create a new station' })
  @ApiBody({ type: CreateStationDto })
  async create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
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
  @ApiOperation({ summary: 'Get all stations' })
  async findAll(@UserDecorator('role') role: RolesEnum, @UserDecorator('depoId') depoId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.stationService.findAll(role, depoId, page, limit);
  }

  @Get(':id')
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.MODERATOR)
  @ApiOperation({ summary: 'Get station by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const station = await this.stationService.findOne(id);
    if (!station) {
      throw new NotFoundException(`Station with id ${id} not found`);
    }
    return station;
  }

  @Patch(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update station by ID' })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto
  ) {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete station by ID' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}
