import { ReleasedVagon } from "src/released-vagons/entities/released-vagon.entity";
import { WagonDepot } from "src/wagon-depots/entities/wagon-depot.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('stations')
export class Station {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => WagonDepot, (wagonDepot) => wagonDepot.stations)
    @JoinColumn({ name: 'wagonDepotId' })
    wagonDepot: WagonDepot;

    @OneToMany(() => ReleasedVagon, (releasedVagon) => releasedVagon.station)
    releasedVagons: ReleasedVagon[];
}
