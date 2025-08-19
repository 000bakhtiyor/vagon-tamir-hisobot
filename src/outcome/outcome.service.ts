import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { And, Between, Equal, IsNull, Not, Repository } from 'typeorm';
import { Station } from 'src/stations/entities/station.entity';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';
import { OperationType } from 'src/common/enums/operation-type.enum';
import { VagonOwnerType } from 'src/common/enums/wagon-owner-type.enum';
import { WagonRepairType } from 'src/common/enums/repair-type.enum';
import { WagonType } from 'src/common/enums/wagom-type.enum';
import { stat } from 'fs';

function normalizeDate(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}
class DepotVagonsDto {
  id: string;
  name: string;
  stations?: any;
  vagons: { vagonNumber: number }[];
  countVagons: number;
}

class ReleaseWagonsResponse {
  depos: Record<string, DepotVagonsDto>;
  allVagonsCount: number;
}
@Injectable()
export class OutcomeService {

  constructor(
    @InjectRepository(WagonDepot)
    private readonly depotRepository: Repository<WagonDepot>,
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    @InjectRepository(ReleasedVagon)
    private readonly releasedVagonRepository: Repository<ReleasedVagon>
  ) { }

  // async getPlannedReleaseWagons(releaseDate?: string, filterType?: 'daily' | 'monthly' | 'yearly'): Promise<BaseResponseDto<any>> {

  //   const query = this.releasedVagonRepository
  //     .createQueryBuilder('wagon')
  //     .leftJoinAndSelect('wagon.station', 'station')
  //     .leftJoinAndSelect('station.wagonDepot', 'depot')
  //     .where('wagon.operation = :operation', { operation: OperationType.Release })
  //     .where('wagon.repairType = :repairType', { repairType: WagonRepairType.PLANNED });

  //   const dateObj = releaseDate ? new Date(releaseDate) : new Date();
  //   const year = dateObj.getFullYear();
  //   const month = dateObj.getMonth() + 1;

  //   if (filterType === 'daily') {
  //     query.andWhere('DATE(wagon.releaseDate) = :date', { date: releaseDate ?? dateObj });
  //   } else if (filterType === 'monthly') {
  //     query.andWhere(
  //       'EXTRACT(MONTH FROM wagon.releaseDate) = :month AND EXTRACT(YEAR FROM wagon.releaseDate) = :year',
  //       { month, year },
  //     );
  //   } else if (filterType === 'yearly') {
  //     query.andWhere('EXTRACT(YEAR FROM wagon.releaseDate) = :year', { year });
  //   }


  //   const wagons = await query.getMany();
  //   console.log(wagons);

  //   interface DepotData {
  //     id: string;
  //     name: string;
  //     stations: Record<
  //       string,
  //       {
  //         id: string;
  //         name: string;
  //         vagons: Omit<typeof wagons[number], 'station'>[];
  //         countVagons: number;
  //       }
  //     >;
  //     countVagons: number;
  //   }

  //   const result: Record<string, DepotData> = {};

  //   wagons.forEach(wagon => {
  //     const depotId = wagon.station.wagonDepot.id;
  //     const depotName = wagon.station.wagonDepot.name;

  //     if (!result[depotId]) {
  //       result[depotId] = {
  //         id: depotId,
  //         name: depotName,
  //         stations: {},
  //         countVagons: 0
  //       };
  //     }

  //     const stationId = wagon.station.id;
  //     const stationName = wagon.station.name;

  //     if (!result[depotId].stations[stationId]) {
  //       result[depotId].stations[stationId] = {
  //         id: stationId,
  //         name: stationName,
  //         vagons: [],
  //         countVagons: 0
  //       };
  //     }

  //     const { station, ...wagonData } = wagon;

  //     result[depotId].stations[stationId].vagons.push(wagonData);
  //     result[depotId].stations[stationId].countVagons++;
  //     result[depotId].countVagons++;
  //   });

  //   const depotsFormatted = Object.values(result).map(depot => ({
  //     id: depot.id,
  //     name: depot.name,
  //     countVagons: depot.countVagons,
  //     stations: Object.values(depot.stations)
  //   }));

  //   return new BaseResponseDto(
  //     depotsFormatted,
  //     'Planned release wagons retrieved',
  //     200
  //   );
  // }

  async getCurrentImportedWagons() {

    const depots = await this.depotRepository
      .createQueryBuilder('depot')
      .leftJoinAndSelect('depot.stations', 'station')
      .leftJoinAndSelect('station.releasedVagons', 'vagon')
      .leftJoinAndSelect('vagon.ownership', 'ownership')
      .leftJoinAndSelect('vagon.repairClassification', 'repairClassification')
      .where('vagon.operation = :operation', { operation: OperationType.Import })
      .andWhere('vagon.repairType = :repairType', { repairType: WagonRepairType.CURRENT })
      .andWhere('vagon.importedDate IS NOT NULL')
      .andWhere('vagon.takenOutDate IS NULL')
      .getMany();
  }

  async getCurrentReleasedWagons(groupId?: string) {
    const depots = await this.depotRepository
      .createQueryBuilder('depot')
      .leftJoinAndSelect('depot.stations', 'station')
      .leftJoinAndSelect('station.releasedVagons', 'vagon')
      .leftJoinAndSelect('vagon.ownership', 'ownership')
      .leftJoinAndSelect('vagon.repairClassification', 'repairClassification')
      .where('vagon.operation = :operation', { operation: OperationType.Release })
      .andWhere('vagon.repairType = :repairType', { repairType: WagonRepairType.CURRENT })
      .andWhere('vagon.releaseDate IS NOT NULL')
      .andWhere('vagon.takenOutDate IS NULL')
      .andWhere('vagon.importedDate IS NULL')
      .getMany();

    let resultOfRepairClassGroup: any[] = [];
    if(groupId){
      const repairClassGroupWagons = await this.depotRepository
      .createQueryBuilder('depot')
        .leftJoinAndSelect('depot.stations', 'station')
        .leftJoinAndSelect('station.releasedVagons', 'vagon')
        .leftJoinAndSelect('vagon.ownership', 'ownership')
        .leftJoinAndSelect('vagon.repairClassification', 'repairClassification')
        .leftJoinAndSelect('repairClassification.group', 'repairGroup')
        .where('vagon.operation = :operation', { operation: OperationType.Release })
        .andWhere('vagon.repairType = :repairType', { repairType: WagonRepairType.CURRENT })
        .andWhere('vagon.releaseDate IS NOT NULL')
        .andWhere('vagon.takenOutDate IS NULL')
        .andWhere('vagon.importedDate IS NULL')
        .andWhere('repairGroup.id = :groupId', { groupId })
        .getMany();
      
      resultOfRepairClassGroup = repairClassGroupWagons.map(depot => {
        const stations = depot.stations.map(station => {
          const releasedVagons = station.releasedVagons.filter(v => v.operation === OperationType.Release && v.repairType === WagonRepairType.CURRENT);
          return {
            id: station.id,
            name: station.name,
            releasedVagons: {
              id: station.releasedVagons.map(v => v.id),
              vagonNumbers: station.releasedVagons.map(v => v.vagonNumber),
              repairClassification: station.releasedVagons.map(v => v.repairClassification),
            },
            countWagons: releasedVagons.length,
          };
        });

        return {
          id: depot.id,
          name: depot.name,
          wagonsCount: stations.reduce((sum, s) => sum + s.countWagons, 0),
          stations,
        };
      });
    }

    const result = depots.map(depot => {
      let depotWagonsCount = 0;

      const stations = (depot.stations || []).map(station => {
        const wagons = station.releasedVagons || [];
        const countWagons = wagons.length;
        depotWagonsCount += countWagons;

        return {
          id: station.id,
          name: station.name,
          releasedVagons: wagons,
          countWagons,
        };
      });

      return {
        id: depot.id,
        name: depot.name,
        wagonsCount: depotWagonsCount,    
        stations,
        resultOfRepairClassGroup: resultOfRepairClassGroup.length > 0 ? resultOfRepairClassGroup : undefined, 
      };
    });

    return result;
  }



  async getPlannedReleaseWagons(
    releaseDate?: string,
    filterType?: 'daily' | 'monthly' | 'yearly'
  ): Promise<BaseResponseDto<ReleaseWagonsResponse>> {
    const depots = await this.depotRepository.find({
      relations: ['stations', 'stations.releasedVagons'],
    });

    let allVagonsCount = 0;
    const depos: Record<string, DepotVagonsDto> = {};

    let startDate: string | null = null;
    let endDate: string | null = null;

    const targetDate = releaseDate ? new Date(releaseDate) : new Date();

    const dayStart = normalizeDate(new Date(targetDate));
    const dayEnd = normalizeDate(new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)); 

    const monthStart = normalizeDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    const monthEnd = normalizeDate(new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1));

    const yearStart = normalizeDate(new Date(targetDate.getFullYear(), 0, 1));
    const yearEnd = normalizeDate(new Date(targetDate.getFullYear() + 1, 0, 1));

    switch (filterType) {
      case 'daily':
        startDate = dayStart;
        endDate = dayEnd;
        break;
      case 'monthly':
        startDate = monthStart;
        endDate = monthEnd;
        break;
      case 'yearly':
        startDate = yearStart;
        endDate = yearEnd;
        break;
      default:
        startDate = dayStart;
        endDate = dayEnd;
        break;
    }


    for (const depot of depots) {
      const vagons: ReleasedVagon[] = depot.stations.flatMap(station => station.releasedVagons);

      let filteredVagons: ReleasedVagon[] = vagons.filter(v => v.operation === OperationType.Release && v.repairType === WagonRepairType.PLANNED);

      if (startDate && endDate) {
        filteredVagons = filteredVagons.filter(v => {
          if (!v.releaseDate) return false;
          const d = normalizeDate(v.releaseDate);
          return d >= startDate && d < endDate; 
        });
      }
      else {
        filteredVagons = filteredVagons.filter(v => v.releaseDate != null);
      }
      allVagonsCount += filteredVagons.length;
      depos[depot.name] = {
        id: depot.id,
        name: depot.name,
        // vagons: filteredVagons.map(v => ({ id: ,vagonNumber: v.vagonNumber })),
        vagons: filteredVagons,
        countVagons: filteredVagons.length,
      };
      delete depos[depot.name].stations;
    }
    return new BaseResponseDto<ReleaseWagonsResponse>(
      {
        depos,
        allVagonsCount,
      },
      "Planned release wagons retrieved",
      200
    );
  }


async getImportTakenOutWagonsCount(
  filterType ?: 'daily' | 'monthly' | 'yearly',
): Promise < BaseResponseDto < any >> {
  const depots = await this.depotRepository.find({
    relations: ['stations', 'stations.releasedVagons'],
  });

  let allVagonsCount = 0;
  let allImportedCount = 0;
  let allExportedCount = 0;

  const depos = {};

  let startDate: any;
  let endDate: any;

  if(!startDate || !endDate) {
  const targetDate = new Date();

  const dayStart = normalizeDate(new Date(targetDate));
  const dayEnd = normalizeDate(new Date(targetDate.setDate(targetDate.getDate() + 1)));

  const monthStart = normalizeDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
  const monthEnd = normalizeDate(new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1));

  const yearStart = normalizeDate(new Date(targetDate.getFullYear(), 0, 1));
  const yearEnd = normalizeDate(new Date(targetDate.getFullYear() + 1, 0, 1));

  switch (filterType) {
    case 'daily':
      startDate = dayStart;
      endDate = dayEnd;
      break;
    case 'monthly':
      startDate = monthStart;
      endDate = monthEnd;
      break;
    case 'yearly':
      startDate = yearStart;
      endDate = yearEnd;
      break;
  }
}

for (const depot of depots) {
  const vagons = depot.stations.flatMap(station => station.releasedVagons);

  let importedCount = 0;
  let exportedCount = 0;

  if (startDate && endDate) {
    importedCount = vagons.filter(v => {
      if (!v.importedDate) return false;
      const d = normalizeDate(v.importedDate);
      return d >= startDate && d < endDate;
    }).length;

    exportedCount = vagons.filter(v => {
      if (!v.takenOutDate) return false;
      const d = normalizeDate(v.takenOutDate);
      return d >= startDate && d < endDate;
    }).length;
  } else {
    importedCount = vagons.filter(v => v.importedDate != null).length;
    exportedCount = vagons.filter(v => v.takenOutDate != null).length;
  }

  allImportedCount += importedCount;
  allExportedCount += exportedCount;

  depos[depot.name] = {
    ...depos[depot.name],
    importedCount,
    exportedCount,
  };

  delete depos[depot.name].stations;
}

return new BaseResponseDto(
  {
    depos,
    AllImportedCount: allImportedCount,
    AllExportedCount: allExportedCount,
  },
  "Planned release wagons with counts retrieved",
  200
);
}



  async getPlannedTakenOutStat(query: { date?: string; ownerType?: VagonOwnerType; ownershipId?: string, filterType?: 'daily' | 'monthly' | 'yearly', vagonType?: WagonType }) {
    const targetDate = query.date ? new Date(query.date) : new Date();

    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);

    const yearStart = new Date(targetDate.getFullYear(), 0, 1);
    const yearEnd = new Date(targetDate.getFullYear() + 1, 0, 1);

    const depotStats = await this.depotRepository
      .createQueryBuilder('depot')
      .leftJoin('depot.stations', 'station')
      .leftJoin('station.releasedVagons', 'vagon')
      .leftJoin('vagon.ownership', 'ownership')
      .select('depot.id', 'depotId')
      .where('vagon.operation = :operation', { operation: OperationType.TakeOut })
      .andWhere('vagon.repairType = :repairType', { repairType: WagonRepairType.PLANNED })
      .where('vagon.takenOutDate IS NOT NULL')
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :dayStart AND vagon."takenOutDate" < :dayEnd
        ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
      )`,
        'dailyCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :monthStart AND vagon."takenOutDate" < :monthEnd
        ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
      )`,
        'monthlyCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :yearStart AND vagon."takenOutDate" < :yearEnd
        ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
      )`,
        'yearlyCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :dayStart AND vagon."takenOutDate" < :dayEnd
        AND vagon."ownerType" = :ownerType
        ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
      )`,
        'dailyOwnerTypeCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :monthStart AND vagon."takenOutDate" < :monthEnd
        AND vagon."ownerType" = :ownerType
        ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
      )`,
        'monthlyOwnerTypeCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :yearStart AND vagon."takenOutDate" < :yearEnd
        AND vagon."ownerType" = :ownerType
        ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
      )`,
        'yearlyOwnerTypeCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
    WHERE vagon."takenOutDate" >= :dayStart AND vagon."takenOutDate" < :dayEnd
    AND vagon."vagonType" = :vagonType
    ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
  )`,
        'dailyVagonTypeCount',
      )
      .addSelect(
        `COUNT(*) FILTER (
    WHERE vagon."takenOutDate" >= :monthStart AND vagon."takenOutDate" < :monthEnd
    AND vagon."vagonType" = :vagonType
    ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
  )`,
        'monthlyVagonTypeCount',
      )
      .addSelect(
        `COUNT(*) FILTER (
    WHERE vagon."takenOutDate" >= :yearStart AND vagon."takenOutDate" < :yearEnd
    AND vagon."vagonType" = :vagonType
    ${query.ownershipId ? 'AND ownership.id = :ownershipId' : ''}
  )`,
        'yearlyVagonTypeCount',
      )

      .groupBy('depot.id')
      .setParameters({
        dayStart,
        dayEnd,
        monthStart,
        monthEnd,
        yearStart,
        yearEnd,
        ownerType: query.ownerType || null,
        ownershipId: query.ownershipId || null,
        vagonType: query.vagonType || null,
      })
      .getRawMany();

    const releasedVagonFilter: any = {
      takenOutDate: Not(IsNull()),
      operation: OperationType.TakeOut,
      repairType: WagonRepairType.PLANNED,
    };

    if (query.ownerType) {
      releasedVagonFilter.ownerType = query.ownerType;
    }

    if (query.vagonType) {
      releasedVagonFilter.vagonType = query.vagonType;
    }

    const depots = await this.depotRepository.find({
      where:{
        stations: {
          releasedVagons: releasedVagonFilter,
        },
      }, 
      relations: ['stations', 'stations.releasedVagons', 'stations.releasedVagons.ownership'],
    });

    const statsMap = new Map(depotStats.map(stat => [stat.depotId, stat]));

    const depotsWithCounts = depots.map(depot => {
      const filteredStations = depot.stations.map(station => ({
        ...station,
        releasedVagons: query.ownershipId
          ? station.releasedVagons.filter(v => v.ownership?.id === query.ownershipId)
          : station.releasedVagons
      }));

      const stat = statsMap.get(depot.id) || {};
      return {
        ...depot,
        stations: filteredStations,
        daily: {
          count: Number(stat.dailyCount || 0),
          ownerType: {
            name: query.ownerType || '',
            dailyCount: Number(stat.dailyOwnerTypeCount || 0),
            monthlyCount: Number(stat.monthlyOwnerTypeCount || 0),
            yearlyCount: Number(stat.yearlyOwnerTypeCount || 0),
          },
          vagonType: {
            name: query.vagonType || '',
            dailyCount: Number(stat.dailyVagonTypeCount || 0),
            monthlyCount: Number(stat.monthlyVagonTypeCount || 0),
            yearlyCount: Number(stat.yearlyVagonTypeCount || 0),
          },
        },
        monthlyCount: Number(stat.monthlyCount || 0),
        yearlyCount: Number(stat.yearlyCount || 0),
      };
    });

    const totalDailyCount = depotStats.reduce((sum, s) => sum + Number(s.dailyCount || 0), 0);
    const totalMonthlyCount = depotStats.reduce((sum, s) => sum + Number(s.monthlyCount || 0), 0);
    const totalYearlyCount = depotStats.reduce((sum, s) => sum + Number(s.yearlyCount || 0), 0);

    return {
      depots: depotsWithCounts,
      totalDailyCount,
      totalMonthlyCount,
      totalYearlyCount,
    };
  }


  async getCurrentTakenOutWagons(query: {date?: string;}){
    const targetDate = query.date ? new Date(query.date) : new Date();

    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);

    const yearStart = new Date(targetDate.getFullYear(), 0, 1);
    const yearEnd = new Date(targetDate.getFullYear() + 1, 0, 1);

    const depotStats = await this.depotRepository
      .createQueryBuilder('depot')
      .leftJoin('depot.stations', 'station')
      .leftJoin('station.releasedVagons', 'vagon')
      .leftJoin('vagon.ownership', 'ownership')
      .select('depot.id', 'depotId')
      .where('vagon.repairType = :repairType', { repairType: WagonRepairType.CURRENT })
      .where('vagon.operation = :operation', { operation: OperationType.TakeOut })
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :dayStart AND vagon."takenOutDate" < :dayEnd
      )`,
        'dailyCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :monthStart AND vagon."takenOutDate" < :monthEnd
      )`,
        'monthlyCount'
      )
      .addSelect(
        `COUNT(*) FILTER (
        WHERE vagon."takenOutDate" >= :yearStart AND vagon."takenOutDate" < :yearEnd
      )`,
        'yearlyCount'
      )
      .groupBy('depot.id')
      .setParameters({
        dayStart,
        dayEnd,
        monthStart,
        monthEnd,
        yearStart,
        yearEnd,
        ownerType: null,
      })
      .getRawMany();

    const depots = await this.depotRepository.find({
      where: { stations: { releasedVagons: { operation: OperationType.TakeOut, repairType: WagonRepairType.CURRENT } } },
      relations: [
        'stations', 
        'stations.releasedVagons', 
        'stations.releasedVagons.ownership', 
        'stations.releasedVagons.repairClassification', 
        'stations.releasedVagons.ownership',
      ],
    });

    const statsMap = new Map(depotStats.map(stat => [stat.depotId, stat]));

    const depotsWithCounts = depots.map(depot => {
      const filteredStations = depot.stations.map(station => ({
        ...station,
        releasedVagons: station.releasedVagons.filter(
          v =>
            v.repairType === WagonRepairType.CURRENT &&
            v.operation === OperationType.TakeOut
        ),
        countWagons: station.releasedVagons.filter(
          v =>
            v.repairType === WagonRepairType.CURRENT &&
            v.operation === OperationType.TakeOut
        ).length
      }));

      const stat = statsMap.get(depot.id) || {};
      return {
        ...depot,
        stations: filteredStations,
      };
    });

    const totalDailyCount = depotStats.reduce((sum, s) => sum + Number(s.dailyCount || 0), 0);
    const totalMonthlyCount = depotStats.reduce((sum, s) => sum + Number(s.monthlyCount || 0), 0);
    const totalYearlyCount = depotStats.reduce((sum, s) => sum + Number(s.yearlyCount || 0), 0);

    return {
      depots: depotsWithCounts,
      totalDailyCount,
      totalMonthlyCount,
      totalYearlyCount,
    };
  }

}
