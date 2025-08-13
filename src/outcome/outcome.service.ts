import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/types/base-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { Repository } from 'typeorm';
import { Station } from 'src/stations/entities/station.entity';
import { ReleasedVagon } from 'src/released-vagons/entities/released-vagon.entity';
import { OperationType } from 'src/common/enums/operation-type.enum';

class DepotVagonsDto {
  id: string;
  name: string;
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
  ){}

  async getPlannedReleaseWagons(releaseDate?: string, filterType?: 'daily' | 'monthly' | 'yearly'): Promise<BaseResponseDto<any>> {

    const query = this.releasedVagonRepository
      .createQueryBuilder('wagon')
      .leftJoinAndSelect('wagon.station', 'station')
      .leftJoinAndSelect('station.wagonDepot', 'depot')
      .where('wagon.operation = :operation', { operation: OperationType.Release });

    if (releaseDate) {
      const dateObj = new Date(releaseDate);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;

      if (filterType === 'daily') {
        query.andWhere('DATE(wagon.releaseDate) = :date', { date: releaseDate });
      } else if (filterType === 'monthly') {
        query.andWhere(
          'EXTRACT(MONTH FROM wagon.releaseDate) = :month AND EXTRACT(YEAR FROM wagon.releaseDate) = :year',
          { month, year },
        );
      } else if (filterType === 'yearly') {
        query.andWhere('EXTRACT(YEAR FROM wagon.releaseDate) = :year', { year });
      }
    } else {
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      if (filterType === 'daily') {
        query.andWhere('DATE(wagon.releaseDate) = :date', { date: releaseDate });
      } else if (filterType === 'monthly') {
        query.andWhere(
          'EXTRACT(MONTH FROM wagon.releaseDate) = :month AND EXTRACT(YEAR FROM wagon.releaseDate) = :year',
          { month, year },
        );
      } else if (filterType === 'yearly') {
        query.andWhere('EXTRACT(YEAR FROM wagon.releaseDate) = :year', { year });
      }
    }

    const wagons = await query.getMany();

    interface DepotData {
      id: string;
      name: string;
      stations: Record<
        string,
        {
          id: string;
          name: string;
          vagons: Omit<typeof wagons[number], 'station'>[];
          countVagons: number;
        }
      >;
      countVagons: number;
    }

    const result: Record<string, DepotData> = {};

    wagons.forEach(wagon => {
      const depotId = wagon.station.wagonDepot.id;
      const depotName = wagon.station.wagonDepot.name;

      if (!result[depotId]) {
        result[depotId] = {
          id: depotId,
          name: depotName,
          stations: {},
          countVagons: 0
        };
      }

      const stationId = wagon.station.id;
      const stationName = wagon.station.name;

      if (!result[depotId].stations[stationId]) {
        result[depotId].stations[stationId] = {
          id: stationId,
          name: stationName,
          vagons: [],
          countVagons: 0
        };
      }

      const { station, ...wagonData } = wagon;

      result[depotId].stations[stationId].vagons.push(wagonData);
      result[depotId].stations[stationId].countVagons++;
      result[depotId].countVagons++;
    });

    const depotsFormatted = Object.values(result).map(depot => ({
      id: depot.id,
      name: depot.name,
      countVagons: depot.countVagons,
      stations: Object.values(depot.stations)
    }));

    return new BaseResponseDto(
      depotsFormatted,
      'Planned release wagons retrieved',
      200
    );
  }



  async getImportTakenOutWagonsCount(): Promise<BaseResponseDto<any>> {
    const depots = await this.depotRepository.find({
      relations: ['stations', 'stations.releasedVagons'],
    });

    let allVagonsCount = 0;
    let allImportedCount = 0;
    let allExportedCount = 0;

    const depos = {};

    for (const depot of depots) {
      const vagons = depot.stations.flatMap(station => station.releasedVagons);

      const importedCount = vagons.filter(v => v.importedDate != null).length;
      const exportedCount = vagons.filter(v => v.takenOutDate != null).length;

      allVagonsCount += vagons.length;
      allImportedCount += importedCount;
      allExportedCount += exportedCount;

      depos[depot.name] = {
        ...depot,
        vagons: vagons.map(v => ({
          vagonNumber: v.vagonNumber,
          importedDate: v.importedDate,
          takenOutDate: v.takenOutDate,
        })),
        countVagons: vagons.length,
        importedCount,
        exportedCount,
      };

      delete depos[depot.name].stations;
}

    return new BaseResponseDto(
      { depos, AllVagonsCount: allVagonsCount, AllImportedCount: allImportedCount, AllExportedCount: allExportedCount },
      "Planned release wagons with counts retrieved",
      200
    );
  }
}
