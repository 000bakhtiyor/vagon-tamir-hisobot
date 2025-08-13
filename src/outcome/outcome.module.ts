import { Module } from '@nestjs/common';
import { OutcomeService } from './outcome.service';
import { OutcomeController } from './outcome.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { Station } from 'src/stations/entities/station.entity';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WagonDepot, Station, ReleasedVagon])],
  controllers: [OutcomeController],
  providers: [OutcomeService],
})
export class OutcomeModule {}
