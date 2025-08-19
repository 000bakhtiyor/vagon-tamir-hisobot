import { Module } from '@nestjs/common';
import { CreateWagonsService } from './create-wagons.service';
import { CreateWagonsController } from './create-wagons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { CreateWagon } from './entities/create-wagon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreateWagon, WagonDepot])],
  controllers: [CreateWagonsController],
  providers: [CreateWagonsService],
})
export class CreateWagonsModule {}
