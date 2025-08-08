import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  BadRequestException,
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
import { UserDecorator } from 'src/common/decorators/user.decorator';

@ApiTags('Vagons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vagons')
export class VagonsController {
  constructor(private readonly vagonsService: VagonsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new vagon' })
  @Roles('superadmin','admin')
  create(@Body() dto: CreateVagonDto, @UserDecorator('vchdId') vchdId: string, @UserDecorator('role') role: string) {
    return this.vagonsService.create(dto, vchdId, role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vagons' })
  findAll(@UserDecorator('vchdId') vchdId: string) {
    return this.vagonsService.findAll(vchdId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one vagon by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.vagonsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update a vagon by ID' })
  @ApiResponse({ status: 200, type: Vagon })
  update(@Param('id') id: string, @Body() dto: UpdateVagonDto, @UserDecorator('vchdId') vchdId: string, @UserDecorator('role') role: string) {
    return this.vagonsService.update(id, dto, vchdId, role);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Delete a vagon by ID' })
  remove(@Param('id') id: string, @UserDecorator('vchdId') vchdId: string, @UserDecorator('role') role: string) {
    return this.vagonsService.remove(id, vchdId, role);
  }
}
