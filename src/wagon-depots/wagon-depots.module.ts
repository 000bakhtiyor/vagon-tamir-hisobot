import { Module } from '@nestjs/common';
import { WagonDepotsService } from './wagon-depots.service';
import { WagonDepotsController } from './wagon-depots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WagonDepot } from './entities/wagon-depot.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WagonDepot, User])],
  controllers: [WagonDepotsController],
  providers: [WagonDepotsService],
})
export class WagonDepotsModule {}
