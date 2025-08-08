import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiBody,
} from '@nestjs/swagger';
import { VchdService } from './vchds.service';
import { CreateVchdDto } from './dto/create-vchd.dto';
import { Vchd } from './entities/vchd.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('VCHDs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vchds')
export class VchdController {
  constructor(private readonly vchdService: VchdService) { }

  @Post()
  @Roles('superadmin')
  @ApiOperation({ summary: 'Create a new VCHD' })
  @ApiBody({
    type: CreateVchdDto,
    examples: {
      example1: {
        summary: 'Basic example',
        value: {
          name: {
            uz: "Vagonlar",
            eng: "Wagons",
            ru: "Вагоны",
            krill: "Вагонлар"
          }
        }
      }
    }
  })
  create(@Body() createVchdDto: CreateVchdDto): Promise<Vchd> {
    return this.vchdService.create(createVchdDto);
  }

  @Get()
  @Roles('superadmin', 'viewer', 'admin')
  @ApiOperation({ summary: 'Get all VCHDs with pagination and filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['vchd.id', 'vchd.uz'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
    @Query('sortBy') sortBy?: 'vchd.id' | 'vchd.uz',
    @Query('order') order?: 'ASC' | 'DESC',
    @User('vchdId') vchdId?: string,
  ): Promise<Vchd[]> {
    return this.vchdService.findAll(page, limit, name, sortBy, order, vchdId);
  }

  @Get('names')
  @Roles('superadmin', 'viewer')
  @ApiOperation({ summary: 'Get only VCHD IDs and names' })
  async findAllOnlyNames(): Promise<Vchd[]> {
    return this.vchdService.findAllOnlyName();
  }

  @Get('vagon-stats')
  @Roles('superadmin', 'viewer', 'admin')
  @ApiOperation({ summary: 'Get wagon import/take-out stats by VCHD' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'date', type: String, required: true, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'type', enum: ['day', 'month', 'year'], required: true })
  @ApiResponse({ status: 200, description: 'Statistics result' })
  async getStatsByType(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('date') selectedDate: Date,
    @Query('type') type: 'day' | 'month' | 'year',
    @User('vchdId') vchdId: string,
    @User('role') role: string
  ) {
    const date = new Date(selectedDate);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD.');
    }
    if (role === 'admin' && (vchdId === null || vchdId === undefined)) {
      throw new ForbiddenException('Admin users must be associated with a VCHD.');
    }

    return this.vchdService.getImportTakenOutStats(page, limit, selectedDate, type, vchdId);
  }

  @Get('taken-out-stats')
  @Roles('superadmin', 'viewer', 'admin')
  @ApiOperation({ summary: 'Get taken out stats by VCHD' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'date', type: String, required: true, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'type', enum: ['day', 'month', 'year'], required: true })
  async getTakenOutStats(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('date') selectedDate: Date,
    @Query('type') type: 'day' | 'month' | 'year',
    @User('vchdId') vchdId: string,
  ) {
    const date = new Date(selectedDate);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD.');
    } 
    return this.vchdService.getTakenOutStats(page, limit, selectedDate, type, vchdId);
  }


  @Get(':id')
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Get a single VCHD by ID' })
  findOne(@Param('id') id: string, @User('vchdId') vchdId: string, @User('role') role: string): Promise<Vchd> {
    return this.vchdService.findOne(id, vchdId, role);
  }
}
