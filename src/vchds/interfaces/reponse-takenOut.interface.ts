import { TakenOutStats } from "./taken-out.interface";

export interface GetTakenOutStatsResponse {
    type: 'day' | 'month' | 'year';
    data: TakenOutStats[];
    allTakenOutCount: number;
    allUrwAJCount: number;
    allPrivateCount: number;
}