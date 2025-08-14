import { LoadStatus } from "src/common/enums/load-status.enum";
import { OperationType } from "src/common/enums/operation-type.enum";
import { WagonRepairType } from "src/common/enums/repair-type.enum";
import { WagonType } from "src/common/enums/wagom-type.enum";
import { VagonOwnerType } from "src/common/enums/wagon-owner-type.enum";
import { Ownership } from "src/ownerships/entities/ownership.entity";
import { RepairClassification } from "src/repair-classifications/entities/repair-classification.entity";
import { Station } from "src/stations/entities/station.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('released_vagons')
export class ReleasedVagon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    vagonNumber: number;

    @Column()
    vagonCode: string;

    @Column({
        type: 'enum',
        enum: WagonType,
        default: WagonType.KR,
        nullable: false
    })
    vagonType: WagonType;

    @Column({ type: 'date', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    releaseDate: Date;

    @Column({
        type: 'enum',
        enum: OperationType,
        default: OperationType.Release,
        nullable: false
    })
    operation: OperationType

    @Column({ type: 'date', nullable: true})
    importedDate: Date

    @Column({ type: 'date', nullable: true})
    takenOutDate: Date

    @ManyToOne(() => RepairClassification, (repairClassification) => repairClassification.releasedVagons)
    @JoinColumn({ name: 'repairClassificationId' })
    repairClassification: RepairClassification;

    @Column({
        type: 'enum',
        enum: VagonOwnerType,
        default: VagonOwnerType.Invertar,
        nullable: false,
    })
    ownerType: VagonOwnerType;

    @ManyToOne(() => Ownership, (ownership) => ownership.releasedVagons)
    @JoinColumn({ name: 'ownershipId' })
    ownership: Ownership;

    @ManyToOne(() => Station, (station) => station.releasedVagons)
    @JoinColumn({ name: 'stationId' })
    station: Station;

    @Column({
        type: 'enum',
        enum: WagonRepairType,
        default: WagonRepairType.PLANNED,
        nullable: false,
    })
    repairType: WagonRepairType;

    @Column({ default: false })
    transitPermit: boolean

    @Column({
        type: 'enum',
        enum: LoadStatus,
        default: LoadStatus.UNLOADED,
    })
    loadStatus: LoadStatus;
}
