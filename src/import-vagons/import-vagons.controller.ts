import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ImportVagonsService } from './import-vagons.service';
import {ImportWagonDto} from './dto/import.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('import-vagons')
export class ImportVagonsController {
  constructor(private readonly importVagonsService: ImportVagonsService) { }

  @Post()
  @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
  @ApiBody({ type: ImportWagonDto })
  @ApiOperation({ summary: 'Import a wagon' })
  async importWagon(@Body() importWagonDto: ImportWagonDto) {
    return this.importVagonsService.importWagon(importWagonDto);
  }

}
