import { ReleasedVagon } from "src/released-vagons/entities/released-vagon.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('ownerships')
export class Ownership {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({ nullable: false })
    ownershipName: string;

    @OneToMany(() => ReleasedVagon, (releasedVagon) => releasedVagon.ownership)
    releasedVagons: ReleasedVagon[];
}
