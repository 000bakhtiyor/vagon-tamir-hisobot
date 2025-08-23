import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WagonDepotsService } from './wagon-depots.service';
import { CreateWagonDepotDto } from './dto/create-wagon-depot.dto';
import { UpdateWagonDepotDto } from './dto/update-wagon-depot.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiBearerAuth()
  @ApiTags('Wagon Depots [superadmin]')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wagon-depots')
export class WagonDepotsController {
  constructor(private readonly wagonDepotsService: WagonDepotsService) { }

  @Post()
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new wagon depot' })
  create(@Body() createWagonDepotDto: CreateWagonDepotDto) {
    return this.wagonDepotsService.create(createWagonDepotDto);
  }
  
  @Get('/names')
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.ADD_ADMIN)
  @ApiOperation({ summary: 'Retrieve all wagon depots' })
  async findAllNames() {
    return this.wagonDepotsService.findAllNames();
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
  @Roles(RolesEnum.SUPERADMIN, RolesEnum.ADD_ADMIN, RolesEnum.ADD_ADMIN)
  @ApiOperation({ summary: 'Retrieve all wagon depots' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.wagonDepotsService.findAll(page, limit);
  }


  @Get(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Retrieve a wagon depot by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the wagon depot' })
  findOne(@Param('id') id: string) {
    return this.wagonDepotsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update a wagon depot by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the wagon depot' })
  update(
    @Param('id') id: string,
    @Body() updateWagonDepotDto: UpdateWagonDepotDto,
  ) {
    return this.wagonDepotsService.update(id, updateWagonDepotDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete a wagon depot by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the wagon depot' })
  remove(@Param('id') id: string) {
    return this.wagonDepotsService.remove(id);
  }
}
