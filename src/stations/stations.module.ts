import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station, WagonDepot])],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
