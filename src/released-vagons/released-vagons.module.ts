import { Module } from '@nestjs/common';
import { ReleasedVagonsService } from './released-vagons.service';
import { ReleasedVagonsController } from './released-vagons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasedVagon } from './entities/released-vagon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ ReleasedVagon])],
  controllers: [ReleasedVagonsController],
  providers: [ReleasedVagonsService],
})
export class ReleasedVagonsModule {}
