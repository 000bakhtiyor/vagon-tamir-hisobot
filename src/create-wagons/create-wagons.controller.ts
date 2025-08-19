import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateWagonsService } from './create-wagons.service';
import { CreateCreateWagonDto } from './dto/create-create-wagon.dto';
import { UpdateCreateWagonDto } from './dto/update-create-wagon.dto';

@Controller('create-wagons')
export class CreateWagonsController {
  constructor(private readonly createWagonsService: CreateWagonsService) { }

  @Post()
  create(@Body() createCreateWagonDto: CreateCreateWagonDto) {
    return this.createWagonsService.create(createCreateWagonDto);
  }

  @Get()
  findAll() {
    return this.createWagonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createWagonsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreateWagonDto: UpdateCreateWagonDto,
  ) {
    return this.createWagonsService.update(id, updateCreateWagonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createWagonsService.remove(id);
  }
}
