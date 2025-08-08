import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vchd } from './entities/vchd.entity';
import { Repository } from 'typeorm';
import { CreateVchdDto, VchdNameDto } from './dto/create-vchd.dto';
import * as dayjs from 'dayjs';
import { GetTakenOutStatsResponse } from './interfaces/reponse-takenOut.interface';
import { TakenOutStats } from './interfaces/taken-out.interface';
import { UpdateVchdDto } from './dto/update-vchd.dto';

@Injectable()
export class VchdService {
  constructor(
    @InjectRepository(Vchd)
    private readonly vchdRepository: Repository<Vchd>,
  ) { }

  // private formatDate(date: Date, format: string): string {
  //   const d = new Date(date);
  //   const iso = d.toISOString();
  //   if (format === 'YYYY-MM-DD') return iso.slice(0, 10);
  //   if (format === 'YYYY-MM') return iso.slice(0, 7);
  //   if (format === 'YYYY') return iso.slice(0, 4);
  //   return iso;
  // }

  async create(dto: CreateVchdDto): Promise<Vchd> {
    const { uz, ru, eng, krill } = dto.name;

    const existing = await this.vchdRepository.findOne({
      where: [
        { uz },
        { ru },
        { eng },
        { krill },
      ],
    });

    if (existing) {
      throw new BadRequestException('VCHD with this name already exists in one of the languages.');
    }

    const vchd = this.vchdRepository.create(dto.name);
    return this.vchdRepository.save(vchd);
  }

  async remove(id: string): Promise<{message: string}> {
    const vchd = await this.vchdRepository.findOne({ where: { id } });
    if (!vchd) {
      throw new NotFoundException(`VCHD with ID ${id} not found.`);
    }
    if (vchd.vagons.length > 0) {
      throw new BadRequestException('Cannot delete VCHD with associated wagons.');
    }
    await this.vchdRepository.remove(vchd);

    return {
      message: `VCHD with ID ${id} has been successfully deleted.`,
    }
  }


  async update(id: string, dto: UpdateVchdDto): Promise<Vchd> {
    const vchd = await this.vchdRepository.findOne({ where: { id } });

    if (!vchd) {
      throw new NotFoundException(`VCHD with ID ${id} not found`);
    }

    Object.assign(vchd, dto.name);
    return this.vchdRepository.save(vchd);
  }
async getTakenOutStats(
  page = 1,
  limit = 10,
  dateStr: Date,
  type: 'day' | 'month' | 'year',
  vchdId ?: string,
): Promise < GetTakenOutStatsResponse > {
  const selectedDate = new Date(dateStr);
  if(isNaN(selectedDate.getTime())) {
  throw new NotFoundException('Invalid date format. Expected YYYY-MM-DD.');
}

const formatMap = {
  day: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
};

const format = formatMap[type];
const dateString = dayjs(selectedDate).format(format);

let vchds: Vchd[];

if (vchdId) {
  const singleVchd = await this.vchdRepository.findOne({
    where: { id: vchdId },
    relations: ['vagons'],
  });

  if (!singleVchd) {
    throw new NotFoundException(`VCHD with ID ${vchdId} not found`);
  }

  vchds = [singleVchd];
} else {
  vchds = await this.vchdRepository.find({
    skip: (page - 1) * limit,
    take: limit,
    relations: ['vagons'],
  });
}

let allTakenOutCount = 0;
let allUrwAJCount = 0;
let allPrivateCount = 0;

  const data = (
    await Promise.all(
      vchds.map(async (vchd): Promise<TakenOutStats | null> => {
        const filteredVagons = vchd.vagons.filter(
          (v) => v.timeTakenOut && dayjs(v.timeTakenOut).format(format) === dateString,
        );

        if (!filteredVagons.length) return null;

        const vagonsWithoutVchd = filteredVagons.map(({ vchd, ...rest }) => rest);

        const urwAJVagons = vagonsWithoutVchd.filter((v) => v.type === 'urwAJ');
        const privateVagons = vagonsWithoutVchd.filter((v) => v.type === 'private');

        const urwAJCount = urwAJVagons.length;
        const privateCount = privateVagons.length;

        allTakenOutCount += vagonsWithoutVchd.length;
        allUrwAJCount += urwAJCount;
        allPrivateCount += privateCount;

        return {
          vchdId: vchd.id,
          name: {
            uz: vchd.uz,
            ru: vchd.ru,
            eng: vchd.eng,
            krill: vchd.krill,
          },
          takenOutCount: vagonsWithoutVchd.length,
          vagons: {
            urwAJ: {
              list: urwAJVagons,
              count: urwAJCount,
            },
            private: {
              list: privateVagons,
              count: privateCount,
            },
          },
        };
      })
    )
  ).filter((item): item is TakenOutStats => item !== null); 

return {
  type,
  data,
  allTakenOutCount,
  allUrwAJCount,
  allPrivateCount,
};
}

  async findAllOnlyName(): Promise<Vchd[]> {
    return this.vchdRepository.find({
      select: ['id', 'uz', 'ru', 'eng', 'krill'],
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    name?: string,
    sortBy: 'vchd.id' | 'vchd.uz' = 'vchd.id',
    order: 'ASC' | 'DESC' = 'ASC',
    vchdId?: string,
  ): Promise<any> {
    const query = this.vchdRepository
      .createQueryBuilder('vchd')
      .leftJoinAndSelect('vchd.vagons', 'vagon')
      .loadRelationCountAndMap('vchd.vagonCount', 'vchd.vagons');

      if (vchdId) {
        query.andWhere('vchd.id = :vchdId', { vchdId });
      }
    

    if (name) {
      query.andWhere(
        `(vchd.uz ILIKE :name OR vchd.ru ILIKE :name OR vchd.eng ILIKE :name OR vchd.krill ILIKE :name)`,
        { name: `%${name}%` },
      );
    }


    const allowedSortFields = ['vchd.id', 'vchd.uz'];
    query.orderBy(
      allowedSortFields.includes(sortBy) ? sortBy : 'vchd.uz',
      order,
    );

    query.skip((page - 1) * limit).take(limit);
    

    const vchds = await query.getMany();
    const allVCHDCount = vchds.reduce((acc, vchd) => acc + (vchd as any).vagonCount, 0);

    const result = vchds.map((vchd) => {
      const { uz, ru, eng, krill, ...rest } = vchd;
      return {
        name: { uz, ru, eng, krill },
        ...rest,
      };
    });

    return {
      data: result,
      totalVCHDCount: allVCHDCount
    };
  }


  async findOne(id: string, vchdId?: string, role?: string): Promise<Vchd> {
    if (role === 'admin' && vchdId && vchdId === id) {
      const vchd = await this.vchdRepository.findOne({ where: { id }, relations: ['vagons'] });
      if (!vchd) throw new NotFoundException(`VCHD with ID ${id} not found`);
      return vchd;
    }
    if (role === 'admin' && vchdId && vchdId !== id) {
      throw new ForbiddenException(`You do not have access to VCHD with ID ${id}`);
    }
    const vchd = await this.vchdRepository.findOne({ where: { id }, relations: ['vagons'] });
    if (!vchd) throw new NotFoundException(`VCHD with ID ${id} not found`);
    return vchd;
  }

  async getImportTakenOutStats(
    page: number = 1,
    limit: number = 10,
    selectedDate: Date,
    type: 'day' | 'month' | 'year',
    vchdId?: string,
  ): Promise<{
    type: string;
    date: string;
    total: number;
    page: number;
    limit: number;
    data: Array<{
      vchdId: string;
      name: {
        uz: string;
        ru: string;
        eng: string;
        krill: string;
      };
      importedCount: number;
      takenOutCount: number;
    }>;
    allImportCount: number;
    allTakenOutCount: number;
  }> {
    const formatMap = {
      day: 'YYYY-MM-DD',
      month: 'YYYY-MM',
      year: 'YYYY',
    };

    const format = formatMap[type];
    if (!format) {
      throw new BadRequestException('Invalid type. Expected "day", "month", or "year".');
    }

    const selectedDated = new Date(selectedDate);
    if (isNaN(selectedDated.getTime())) {
      throw new BadRequestException('Invalid date format. Expected a valid Date.');
    }

    const dateStr = selectedDated.toISOString().split('T')[0].slice(0, format.length);

    const query = this.vchdRepository
      .createQueryBuilder('vchd')
      .leftJoin('vchd.vagons', 'vagon')
      .select('vchd.id', 'vchdId')
      .addSelect('vchd.uz', 'vchdNameUz')
      .addSelect('vchd.ru', 'vchdNameRu')
      .addSelect('vchd.eng', 'vchdNameEng')
      .addSelect('vchd.krill', 'vchdNameKrill')
      .addSelect(
        `COUNT(CASE WHEN TO_CHAR(vagon.importedTime, :format) = :date THEN 1 END)`,
        'importedCount',
      )
      .addSelect(
        `COUNT(CASE WHEN TO_CHAR(vagon.timeTakenOut, :format) = :date THEN 1 END)`,
        'takenOutCount',
      )
      .groupBy('vchd.id')
      .addGroupBy('vchd.uz')
      .addGroupBy('vchd.ru')
      .addGroupBy('vchd.eng')
      .addGroupBy('vchd.krill')
      .setParameters({ format, date: dateStr });

    if (vchdId) {
      query.where('vchd.id = :vchdId', { vchdId });
    }

    const rawStats = await query.getRawMany();

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedStats = rawStats.slice(start, end);

    const allImportCount = rawStats.reduce((acc, curr) => acc + Number(curr.importedCount), 0);
    const allTakenOutCount = rawStats.reduce((acc, curr) => acc + Number(curr.takenOutCount), 0);

    const fixedVCHDS = paginatedStats.map((item) => ({
      vchdId: item.vchdId,
      name: {
        uz: item.vchdNameUz,
        ru: item.vchdNameRu,
        eng: item.vchdNameEng,
        krill: item.vchdNameKrill,
      },
      importedCount: Number(item.importedCount),
      takenOutCount: Number(item.takenOutCount),
    }));

    return {
      type,
      date: dateStr,
      total: rawStats.length,
      page,
      limit,
      data: fixedVCHDS,
      allImportCount,
      allTakenOutCount,
    };
  }

}
