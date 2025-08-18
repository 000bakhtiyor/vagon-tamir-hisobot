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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReleasedVagonsService } from './released-vagons.service';
import { CreateReleasedVagonDto } from './dto/create-released-vagon.dto';
import { UpdateReleasedVagonDto } from './dto/update-released-vagon.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { FindReleasedVagonsQueryDto } from './dto/find-released-vagon-query.dto';

@ApiTags('Released Vagons [ALL]')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('released-vagons')
export class ReleasedVagonsController {
  constructor(
    private readonly releasedVagonsService: ReleasedVagonsService,
  ) { }

  @Post()
  @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create a released vagon record [MODERATOR, SUPERADMIN]' })
  @ApiBody({ type: CreateReleasedVagonDto })
  create(@Body() createReleasedVagonDto: CreateReleasedVagonDto, @UserDecorator('role') role: RolesEnum, @UserDecorator('depoId') depoId: string) {
    return this.releasedVagonsService.create(createReleasedVagonDto, role, depoId);
  }

  @Get()
  @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN, RolesEnum.VIEWER)
  @ApiOperation({ summary: 'Get all released vagons [ALL]' })
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
  async findAll(
    @UserDecorator('role') role: RolesEnum, 
    @UserDecorator('depoId') depoId: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query() query: FindReleasedVagonsQueryDto,
  ) {
    const {
      wagonNumber,
      wagonCode,
      vagonType,
      releaseDate,
      ownerType,
      repairClassificationId,
      ownershipId,
      stationId,
      importedDate,
      takenOutDate
    } = query;
    return this.releasedVagonsService.findAll(
      role,
      depoId,
      page,
      limit,
      wagonNumber,
      wagonCode,
      vagonType,
      releaseDate,
      ownerType,
      repairClassificationId,
      ownershipId,
      stationId,
      importedDate,
      takenOutDate
    );
  }

  @Get(':id')
  @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get a released vagon by ID [MODERATOR, SUPERADMIN]' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Released vagon unique identifier',
  })
  findOne(@Param('id') id: string) {
    return this.releasedVagonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update a released vagon [MODERATOR, SUPERADMIN]' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Released vagon unique identifier',
  })
  @ApiBody({ type: UpdateReleasedVagonDto })
  update(
    @Param('id') id: string,
    @Body() updateReleasedVagonDto: UpdateReleasedVagonDto,
  ) {
    return this.releasedVagonsService.update(id, updateReleasedVagonDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete a released vagon [MODERATOR, SUPERADMIN]' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Released vagon unique identifier',
  })
  remove(@Param('id') id: string) {
    return this.releasedVagonsService.remove(id);
  }
}
