import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OutcomeService } from './outcome.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserDecorator } from 'src/common/decorators/user.decorator';

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
}
