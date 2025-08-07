import { Module } from '@nestjs/common';
import { VchdService } from './vchds.service';
import { VchdController } from './vchds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vchd } from './entities/vchd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vchd])],
  controllers: [VchdController],
  providers: [VchdService],
})
export class VchdsModule {}
