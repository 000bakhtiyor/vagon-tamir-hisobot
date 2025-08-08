import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReleasedVagonsService } from './released-vagons.service';
import { CreateReleasedVagonDto } from './dto/create-released-vagon.dto';
import { UpdateReleasedVagonDto } from './dto/update-released-vagon.dto';

@Controller('released-vagons')
export class ReleasedVagonsController {
  constructor(private readonly releasedVagonsService: ReleasedVagonsService) {}

  @Post()
  create(@Body() createReleasedVagonDto: CreateReleasedVagonDto) {
    return this.releasedVagonsService.create(createReleasedVagonDto);
  }

  @Get()
  findAll() {
    return this.releasedVagonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releasedVagonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReleasedVagonDto: UpdateReleasedVagonDto) {
    return this.releasedVagonsService.update(+id, updateReleasedVagonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releasedVagonsService.remove(+id);
  }
}
