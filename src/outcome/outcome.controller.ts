import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OutcomeService } from './outcome.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { VagonOwnerType } from 'src/common/enums/wagon-owner-type.enum';
import { WagonType } from 'src/common/enums/wagom-type.enum';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('outcome')
export class OutcomeController {
  constructor(private readonly outcomeService: OutcomeService) {}

  @Get('/DO2/broken/')
  @ApiOperation({ summary: 'Get broken wagons statistics according to DO-2' })
  async getBrokenWagonsStatistics(){
    return this.outcomeService.getBrokenWagonsStatistics();
  }

  @Get('current/imported/')
  @ApiOperation({ summary: 'Get current imported wagons statistics' })
  async getCurrentImportedWagons(){
    return this.outcomeService.getCurrentImportedWagonsCount();
  }

  @ApiQuery({ name: 'filterType', required: false, enum: ['daily', 'monthly', 'yearly'] })
  @ApiQuery({ name: 'releaseDate', required: false, type: String, description: 'Date in format YYYY-MM-DD' })
  @Get('/planned/released/')
 async getPlannedReleaseWagons(@Query('releaseDate') releaseDate?: string, @Query('filterType') filterType?: 'daily' | 'monthly' | 'yearly'){
    return this.outcomeService.getPlannedReleaseWagons(releaseDate, filterType)
  }

  @ApiQuery({ name: 'filterType', required: false, enum: ['daily', 'monthly', 'yearly'] })
  @Get('/planned/import-taken-out')
  async getImportTakenOutWagonsCount(@UserDecorator('depoId') depoId: string, @Query('filterType') filterType?: 'daily' | 'monthly' | 'yearly') {
    return this.outcomeService.getImportTakenOutWagonsCount(filterType)
  }

  @Get('/planned/taken-out')
  @ApiOperation({ summary: 'Get planned taken-out wagons statistics' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Optional date to filter statistics (YYYY-MM-DD). Defaults to today if not provided.',
    type: String,
  })
  @ApiQuery({
    name: 'ownerType',
    required: false,
    description: 'Optional owner type to filter wagons',
    enum: VagonOwnerType,
  })
  @ApiQuery({
    name: 'vagonType',
    required: false,
    description: 'Optional owner type to filter wagons',
    enum: WagonType,
  })
  @ApiQuery({
    name: 'ownershipId',
    required: false,
    description: 'Optional ownership ID to filter results by a specific ownership entity.',
    type: String,
  })
  async getPlannedTakenOutStat(
    @Query('date') date?: string,
    @Query('ownerType') ownerType?: VagonOwnerType,
    @Query('ownershipId') ownershipId?: string,
    @Query('vagonType') vagonType?: WagonType,
  ) {
    return this.outcomeService.getPlannedTakenOutStat({ date, ownerType, ownershipId, vagonType });
  }

  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Optional date to filter statistics (YYYY-MM-DD). Defaults to today if not provided.',
    type: String,
  })
  @Get('current/taken-out/')
  async getCurrentTakenOutWagons(
    @Query('date') date?: string,
  ){
    return this.outcomeService.getCurrentTakenOutWagons({date});
  }

  @Get('current/released/')
  @ApiOperation({ summary: 'Get current released wagons statistics' })
  @ApiQuery({
    name: 'groupId',
    required: false,
    description: 'Optional group ID to filter results by a specific repair classification group.',
    type: String,
  })
  async getCurrentReleasedWagons(@Query('groupId') groupId?: string) {
    return this.outcomeService.getCurrentReleasedWagons(groupId);
  }

}
