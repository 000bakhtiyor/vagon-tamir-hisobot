import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OwnershipsService } from './ownerships.service';
import { CreateOwnershipDto } from './dto/create-ownership.dto';
import { UpdateOwnershipDto } from './dto/update-ownership.dto';

@Controller('ownerships')
export class OwnershipsController {
  constructor(private readonly ownershipsService: OwnershipsService) {}

  @Post()
  create(@Body() createOwnershipDto: CreateOwnershipDto) {
    return this.ownershipsService.create(createOwnershipDto);
  }
}
