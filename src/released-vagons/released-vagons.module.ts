import { Module } from '@nestjs/common';
import { ReleasedVagonsService } from './released-vagons.service';
import { ReleasedVagonsController } from './released-vagons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasedVagon } from './entities/released-vagon.entity';
import { Station } from 'src/stations/entities/station.entity';
import { Ownership } from 'src/ownerships/entities/ownership.entity';
import { RepairClassification } from 'src/repair-classifications/entities/repair-classification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ ReleasedVagon, Station, Ownership, RepairClassification])],
  controllers: [ReleasedVagonsController],
  providers: [ReleasedVagonsService],
})
export class ReleasedVagonsModule {}
