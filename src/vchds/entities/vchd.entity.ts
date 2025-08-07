import { Vagon } from "src/vagons/entities/vagon.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vchd {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    uz: string;

    @Column()
    eng: string;
    
    @Column()
    ru: string;

    @Column()
    krill: string;

    @OneToMany(()=> Vagon, (vagon)=> vagon.vchd)
    vagons: Vagon[]
}
