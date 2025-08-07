import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vchd } from './entities/vchd.entity';
import { Repository } from 'typeorm';
import { CreateVchdDto, VchdNameDto } from './dto/create-vchd.dto';

@Injectable()
export class VchdService {
  constructor(
    @InjectRepository(Vchd)
    private readonly vchdRepository: Repository<Vchd>,
  ) { }

  private formatDate(date: Date, format: string): string {
    const d = new Date(date);
    const iso = d.toISOString();
    if (format === 'YYYY-MM-DD') return iso.slice(0, 10);
    if (format === 'YYYY-MM') return iso.slice(0, 7);
    if (format === 'YYYY') return iso.slice(0, 4);
    return iso;
  }

  async create(dto: CreateVchdDto): Promise<Vchd> {
    const vchd = this.vchdRepository.create(dto.name);
    return this.vchdRepository.save(vchd);
  }

  async getTakenOutStats(
    page = 1,
    limit = 10,
    dateStr: Date,
    type: 'day' | 'month' | 'year',
  ): Promise<any> {
    const selectedDate = new Date(dateStr);
    if (isNaN(selectedDate.getTime())) {
      throw new NotFoundException('Invalid date format. Expected YYYY-MM-DD.');
    }

    const format = type === 'day' ? 'YYYY-MM-DD' : type === 'month' ? 'YYYY-MM' : 'YYYY';
    const dateString = selectedDate.toISOString().slice(0, format.length);

    const vchds = await this.vchdRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['vagons'],
    });

    let allTakenOutCount = 0;
    let allUrwAJCount = 0;
    let allPrivateCount = 0;

    const data = (
      await Promise.all(
        vchds.map(async (vchd) => {
          const filteredVagons = vchd.vagons.filter((v) =>
            v.timeTakenOut &&
            this.formatDate(v.timeTakenOut, format) === dateString
          );

          if (!filteredVagons.length) return null;

          const vagonsWithoutVchd = filteredVagons.map(({ vchd, ...rest }) => rest);

          const urwAJVagons = vagonsWithoutVchd.filter(v => v.type === 'urwAJ');
          const privateVagons = vagonsWithoutVchd.filter(v => v.type === 'private');

          const urwAJCount = urwAJVagons.length;
          const privateCount = privateVagons.length;

          // Accumulate global totals
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
    ).filter(Boolean); 

    return {
      type,
      data,
      allTakenOutCount,
      allUrwAJCount,
      allPrivateCount,
    };
  }



  async findAll(
    page = 1,
    limit = 10,
    name?: string,
    sortBy: 'vchd.id' | 'vchd.uz'  = 'vchd.id',
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<any> {
    const query = this.vchdRepository
      .createQueryBuilder('vchd')
      .leftJoinAndSelect('vchd.vagons', 'vagon')
      .loadRelationCountAndMap('vchd.vagonCount', 'vchd.vagons');

    if (name) {
      query.andWhere(
        `(vchd.uz ILIKE :name OR vchd.ru ILIKE :name OR vchd.eng ILIKE :name OR vchd.krill ILIKE :name)`,
        { name: `%${name}%` }
      );
    }

    const allowedSortFields = ['vchd.id', 'vchd.uz'];
    if (allowedSortFields.includes(sortBy)) {
      query.orderBy(sortBy, order);
    } else {
      query.orderBy('vchd.id', 'ASC'); 
    }

    query.skip((page - 1) * limit).take(limit);

    const vchds = await query.getMany();

    const allCount = vchds.reduce((acc, vchd) => acc + (vchd as any).vagonCount, 0);

    const result = vchds.map(vchd => {
      const { uz, ru, eng, krill, ...rest } = vchd;
      return {
        name: { uz, ru, eng, krill },
        ...rest
      };
    });

    return {
      data: result,
      allCount
    };
  }

  async findOne(id: string): Promise<Vchd> {
    const vchd = await this.vchdRepository.findOne({ where: { id }, relations: ['vagons'] });
    if (!vchd) throw new NotFoundException(`VCHD with ID ${id} not found`);
    return vchd;
  }

  async seedInitialData(): Promise<void> {
    const existing = await this.vchdRepository.count();
    if (existing > 0) return;

    const data: VchdNameDto[] = [
      { uz: 'Toshkent', eng: 'Tashkent', ru: 'Ташкент', krill: 'Тошкент' },
      { uz: "Qo'qond", eng: "Kokand", ru: 'Коканд', krill: "Қўқон" },
      { uz: 'Buxoro', eng: 'Bukhara', ru: 'Бухара', krill: 'Бухоро' },
      { uz: "Qo'ng'irot", eng: "Kungirot", ru: 'Кунград', krill: "Қўнғирот" },
      { uz: "Qarshi", eng: "Karshi", ru: 'Карши', krill: 'Қарши' },
      { uz: "Termiz", eng: "Termez", ru: 'Термез', krill: 'Термиз' },
      { uz: "Andijon", eng: "Andijan", ru: 'Андижан', krill: 'Андижон' },
      { uz: "Xavast", eng: "Khavast", ru: 'Хаваст', krill: 'Хаваст' },
      { uz: "Samarqand", eng: "Samarkand", ru: 'Самарканд', krill: 'Самарқанд' },
      { uz: "`QMZ` AJ", eng: "`QMZ` JSC", ru: "`КМЗ` АО", krill: "`ҚМЗ` АЖ" },
      { uz: "`AMZ` SHK", eng: "`AMZ` LLC", ru: "`АМЗ` ООО", krill: "`АМЗ` ШҚК" },
    ];

    await this.vchdRepository.save(data);
  }

  async getImportTakenOutStats(
    page: number, limit: number, selectedDate: Date, type: 'day' | 'month' | 'year',
    ): Promise<any> {
      let format: string;

      switch (type) {
        case 'day':
          format = 'YYYY-MM-DD';
          break;
        case 'month':
          format = 'YYYY-MM';
          break;
        case 'year':
          format = 'YYYY';
          break;
        default:
          throw new Error('Invalid type. Expected day, month, or year.');
      }
      const selectedDated = new Date(selectedDate);
      if (isNaN(selectedDated.getTime())) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD.');
      }
      const dateStr = selectedDated.toISOString().split('T')[0].slice(0, format.length); 

      const vchds = await this.vchdRepository
        .createQueryBuilder('vchd')
        .leftJoin('vchd.vagons', 'vagon')
        .select('vchd.id', 'vchdId')
        .addSelect('vchd.uz', 'vchdNameUz')
        .addSelect('vchd.ru', 'vchdNameRu')
        .addSelect('vchd.eng', 'vchdNameEng')
        .addSelect('vchd.krill', 'vchdNameKrill')
        .addSelect(
          `COUNT(CASE WHEN TO_CHAR(vagon.importedTime, :format) = :date THEN 1 END)`,
          'importedCount'
        )
        .addSelect(
          `COUNT(CASE WHEN TO_CHAR(vagon.timeTakenOut, :format) = :date THEN 1 END)`,
          'takenOutCount'
        )
        .groupBy('vchd.id')
        .addGroupBy('vchd.uz')
        .addGroupBy('vchd.ru')
        .addGroupBy('vchd.eng')
        .addGroupBy('vchd.krill')
        .setParameters({ format, date: dateStr })
        .getRawMany();

      const allImportCount = vchds.reduce((acc, vchd) => acc + Number(vchd.importedCount), 0);
      const allTakenOutCount = vchds.reduce((acc, vchd) => acc + Number(vchd.takenOutCount), 0);
      const fixedVCHDS = vchds.map((item) => ({
        vchdId: item.vchdId,
        name: {
          uz: item.vchdNameUz,
          eng: item.vchdNameEng,
          ru: item.vchdNameRu,
          krill: item.vchdNameKrill,
        },
        importedCount: item.importedCount,
        takenOutCount: item.takenOutCount,
      }));

      return {
        type,
        date: dateStr,
        data: fixedVCHDS,
        allImportCount,
        allTakenOutCount,
      };
  }


}
