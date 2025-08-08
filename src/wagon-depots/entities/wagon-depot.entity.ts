import { Station } from "src/stations/entities/station.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('wagon_depots')
export class WagonDepot {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @OneToMany(() => Station, (station) => station.wagonDepot)
    stations: Station[];
}
