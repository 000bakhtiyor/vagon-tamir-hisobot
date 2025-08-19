import { CreateWagon } from "src/create-wagons/entities/create-wagon.entity";
import { Station } from "src/stations/entities/station.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('wagon_depots')
export class WagonDepot {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @ManyToMany(()=> User, (user) => user.depots)
    @JoinTable()
    admins: User[]

    @OneToMany(() => Station, (station) => station.wagonDepot)
    stations: Station[];

    @OneToMany(() => CreateWagon, (createWagon) => createWagon.wagonDepot)
    @JoinColumn()
    createWagons: CreateWagon[];
}
