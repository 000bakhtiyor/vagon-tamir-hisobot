import { Module } from '@nestjs/common';
import { WagonDepotsService } from './wagon-depots.service';
import { WagonDepotsController } from './wagon-depots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WagonDepot } from './entities/wagon-depot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WagonDepot])],
  controllers: [WagonDepotsController],
  providers: [WagonDepotsService],
})
export class WagonDepotsModule {}
