import { Module } from '@nestjs/common';
import { VagonsService } from './vagons.service';
import { VagonsController } from './vagons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vagon } from './entities/vagon.entity';
import { Vchd } from 'src/vchds/entities/vchd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vagon, Vchd])],
  controllers: [VagonsController],
  providers: [VagonsService],
})
export class VagonsModule {}
