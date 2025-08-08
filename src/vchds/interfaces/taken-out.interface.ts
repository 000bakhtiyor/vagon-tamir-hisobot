import { Vagon } from "src/vagons/entities/vagon.entity";
import { VagonWithoutVchdDto } from "../dto/wagon-without-vchd.dto";

export interface TakenOutStats {
    vchdId: string;
    name: {
        uz: string;
        ru: string;
        eng: string;
        krill: string;
    };
    takenOutCount: number;
    vagons: {
        urwAJ: {
            list: VagonWithoutVchdDto[];
            count: number;
        };
        private: {
            list: VagonWithoutVchdDto[];
            count: number;
        };
    };
}