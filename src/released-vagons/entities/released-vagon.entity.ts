import { WagonRepairType } from "src/common/enums/repair.type";
import { VagonOwnerType } from "src/common/enums/wagon.type";
import { Ownership } from "src/ownerships/entities/ownership.entity";
import { RepairClassification } from "src/repair-classifications/entities/repair-classification.entity";
import { Station } from "src/stations/entities/station.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('released_vagons')
export class ReleasedVagon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    vagonNumber: number;

    @Column({ nullable: false})
    vagonCode: string;

    @Column({type: 'date', nullable: false})
    releaseDate: Date;

    @ManyToOne(()=> Ownership, (ownership) => ownership.releasedVagons)
    @JoinColumn({ name: 'ownershipId' })
    ownership: Ownership;

    @ManyToOne(() => RepairClassification, (repairClassification) => repairClassification.releasedVagons)
    @JoinColumn({ name: 'repairClassificationId' })
    repairClassification: RepairClassification;

    @Column({
        type: 'enum',
        enum: VagonOwnerType,
        default: VagonOwnerType.UZBEKISTAN_RAILWAYS,
        nullable: false,
    })
    ownerType: VagonOwnerType;

    @ManyToOne(()=> Station, (station) => station.releasedVagons)
    @JoinColumn({ name: 'stationId' })
    station: Station;

    @Column({
        type: 'enum',
        enum: WagonRepairType,
        default: WagonRepairType.PLANNED,
        nullable: false,
    })
    repairType: WagonRepairType;
}
