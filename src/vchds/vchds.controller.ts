import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
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

@ApiTags('VCHDs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vchds')
export class VchdController {
  constructor(private readonly vchdService: VchdService) { }

  @Post()
  @Roles('admin')
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
  @ApiOperation({ summary: 'Get all VCHDs' })
  @ApiResponse({ status: 200, description: 'List of all VCHDs', type: [Vchd] })
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
  ): Promise<Vchd[]> {
    return this.vchdService.findAll(page, limit, name, sortBy, order);
  }

  @Get('vagon-stats')
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
  ) {
    const date = new Date(selectedDate);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD.');
    }

    return this.vchdService.getImportTakenOutStats(page, limit, selectedDate, type);
  }

  @Get('taken-out-stats')
  @ApiOperation({ summary: 'Get taken out stats by VCHD' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'date', type: String, required: true, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'type', enum: ['day', 'month', 'year'], required: true })
  @ApiResponse({ status: 200, description: 'Statistics result' })
  async getTakenOutStats(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('date') selectedDate: Date,
    @Query('type') type: 'day' | 'month' | 'year',
  ) {
    const date = new Date(selectedDate);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD.');
    } 
    return this.vchdService.getTakenOutStats(page, limit, selectedDate, type);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a single VCHD by ID' })
  @ApiResponse({
    status: 200,
    description: 'The requested VCHD entity',
    type: CreateVchdDto,
  })
  findOne(@Param('id') id: string): Promise<Vchd> {
    return this.vchdService.findOne(id);
  }
}
