import { ReleasedVagon } from "src/released-vagons/entities/released-vagon.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('repair_classifications')
export class RepairClassification {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    code: number;

    @Column({nullable: false })
    classificationCode: number;

    @Column({nullable: false })
    shortDescription: string;

    @Column({nullable: false })
    text: string;

    @OneToMany(()=> ReleasedVagon, (releasedVagon) => releasedVagon.repairClassification)
    releasedVagons: ReleasedVagon[];
}
