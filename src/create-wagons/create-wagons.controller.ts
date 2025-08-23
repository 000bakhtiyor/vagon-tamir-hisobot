import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateWagonsService } from './create-wagons.service';
import { CreateWagonDto } from './dto/create-create-wagon.dto';
import { UpdateCreateWagonDto } from './dto/update-create-wagon.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Create Wagons')
@Controller('create-wagons')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CreateWagonsController {
  constructor(private readonly createWagonsService: CreateWagonsService) { }

  @Post()
  @Roles(RolesEnum.ADD_ADMIN, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create new wagon'})
  @ApiBody({ type: CreateWagonDto })
  create(@Body() CreateWagonDto: CreateWagonDto) {
    return this.createWagonsService.create(CreateWagonDto);
  }

  @Get('/depots')
  @Roles(RolesEnum.ADD_ADMIN, RolesEnum.SUPERADMIN, RolesEnum.VIEWER)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAllWithDepots(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ){
    return this.createWagonsService.findAllWithDepots(Number(page), Number(limit));
  }

  @Get()
  @Roles(RolesEnum.ADD_ADMIN, RolesEnum.SUPERADMIN, RolesEnum.VIEWER)
  @ApiOperation({ summary: 'Get all wagons (with pagination & filtering)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'wagonNumber', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('wagonNumber') wagonNumber?: string,
  ) {
    return this.createWagonsService.findAll(page, limit, wagonNumber);
  }

  @Get(':id')
  @Roles(RolesEnum.ADD_ADMIN, RolesEnum.SUPERADMIN, RolesEnum.VIEWER)
  @ApiOperation({ summary: 'Get wagon by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.createWagonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADD_ADMIN, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update wagon by ID' })
  @ApiParam({ name: 'id', type: String })
  update(
    @Param('id') id: string,
    @Body() updateCreateWagonDto: UpdateCreateWagonDto,
  ) {
    return this.createWagonsService.update(id, updateCreateWagonDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADD_ADMIN, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete wagon by ID' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.createWagonsService.remove(id);
  }
}
