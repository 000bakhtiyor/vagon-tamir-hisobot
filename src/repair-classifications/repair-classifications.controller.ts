import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairClassificationsService } from './repair-classifications.service';
import { CreateRepairClassificationDto } from './dto/create-repair-classification.dto';
import { UpdateRepairClassificationDto } from './dto/update-repair-classification.dto';

@Controller('repair-classifications')
export class RepairClassificationsController {
  constructor(private readonly repairClassificationsService: RepairClassificationsService) {}

  @Post()
  create(@Body() createRepairClassificationDto: CreateRepairClassificationDto) {
    return this.repairClassificationsService.create(createRepairClassificationDto);
  }

  @Get()
  findAll() {
    return this.repairClassificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairClassificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairClassificationDto: UpdateRepairClassificationDto) {
    return this.repairClassificationsService.update(+id, updateRepairClassificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairClassificationsService.remove(+id);
  }
}
