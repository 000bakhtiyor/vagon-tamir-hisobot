import { Module } from '@nestjs/common';
import { OwnershipsService } from './ownerships.service';
import { OwnershipsController } from './ownerships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ownership } from './entities/ownership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ownership])],
  controllers: [OwnershipsController],
  providers: [OwnershipsService],
})
export class OwnershipsModule {}
