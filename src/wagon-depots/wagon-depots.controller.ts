import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WagonDepotsService } from './wagon-depots.service';
import { CreateWagonDepotDto } from './dto/create-wagon-depot.dto';

@Controller('wagon-depots')
export class WagonDepotsController {
  constructor(private readonly wagonDepotsService: WagonDepotsService) {}

  @Post()
  create(@Body() createWagonDepotDto: CreateWagonDepotDto) {
    return this.wagonDepotsService.create(createWagonDepotDto);
  }
}
