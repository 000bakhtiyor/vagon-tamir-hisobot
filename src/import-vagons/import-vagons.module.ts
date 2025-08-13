import { Module } from '@nestjs/common';
import { ImportVagonsService } from './import-vagons.service';
import { ImportVagonsController } from './import-vagons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReleasedVagon])],
  controllers: [ImportVagonsController],
  providers: [ImportVagonsService],
})
export class ImportVagonsModule {}
