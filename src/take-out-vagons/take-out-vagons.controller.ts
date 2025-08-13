import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TakeOutVagonsService } from './take-out-vagons.service';
import { TakenOutWagonDto } from './dto/taken-out.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/common/enums/role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('take-out-vagons')
export class TakeOutVagonsController {
  constructor(private readonly takeOutVagonsService: TakeOutVagonsService) {}

    @Post()
    @Roles(RolesEnum.MODERATOR, RolesEnum.SUPERADMIN)
    @ApiBody({ type: TakenOutWagonDto })
    @ApiOperation({ summary: 'Import a wagon' })
    async importWagon(@Body() takenOutWagonDto: TakenOutWagonDto) {
      return this.takeOutVagonsService.takeOutWagon(takenOutWagonDto);
    }
}
