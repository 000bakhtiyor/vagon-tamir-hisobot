import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { VagonsService } from './vagons.service';
import { CreateVagonDto } from './dto/create-vagon.dto';
import { UpdateVagonDto } from './dto/update-vagon.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Vagon } from './entities/vagon.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Vagons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vagons')
export class VagonsController {
  constructor(private readonly vagonsService: VagonsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new vagon' })
  @ApiResponse({ status: 201, type: Vagon })
  @Roles('admin')
  create(@Body() dto: CreateVagonDto) {
    return this.vagonsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vagons' })
  @ApiResponse({ status: 200, type: [Vagon] })
  findAll() {
    return this.vagonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one vagon by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Vagon })
  findOne(@Param('id') id: string) {
    return this.vagonsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a vagon by ID' })
  @ApiResponse({ status: 200, type: Vagon })
  update(@Param('id') id: string, @Body() dto: UpdateVagonDto) {
    return this.vagonsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a vagon by ID' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.vagonsService.remove(id);
  }
}
