import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OutcomeService } from './outcome.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { VagonOwnerType } from 'src/common/enums/wagon-owner-type.enum';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('outcome')
export class OutcomeController {
  constructor(private readonly outcomeService: OutcomeService) {}

  @ApiQuery({ name: 'filterType', required: false, enum: ['daily', 'monthly', 'yearly'] })
  @ApiQuery({ name: 'releaseDate', required: false, type: String, description: 'Date in format YYYY-MM-DD' })
  @Get('/planned/released/wagons')
 async getPlannedReleaseWagons(@Query('releaseDate') releaseDate?: string, @Query('filterType') filterType?: 'daily' | 'monthly' | 'yearly'){
    return this.outcomeService.getPlannedReleaseWagons(releaseDate, filterType)
  }

  @Get('/planned/import-taken-out/wagons')
  async getImportTakenOutWagonsCount(@UserDecorator('depoId') depoId: string) {
    return this.outcomeService.getImportTakenOutWagonsCount()
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
  async getPlannedTakenOutStat(
    @Query('date') date?: string,
    @Query('ownerType') ownerType?: VagonOwnerType
  ) {
    return this.outcomeService.getPlannedTakenOutStat({ date, ownerType });
  }
}
