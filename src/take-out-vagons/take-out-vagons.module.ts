import { Module } from '@nestjs/common';
import { TakeOutVagonsService } from './take-out-vagons.service';
import { TakeOutVagonsController } from './take-out-vagons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReleasedVagon])],
  controllers: [TakeOutVagonsController],
  providers: [TakeOutVagonsService],
})
export class TakeOutVagonsModule {}
