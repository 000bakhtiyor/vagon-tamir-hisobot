import { ReleasedVagon } from "src/released-vagons/entities/released-vagon.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RepairClassificationGroup } from "./repair-classification-group.entity";

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

    @ManyToOne(() => RepairClassificationGroup, (group) => group.classifications, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_id' })
    group: RepairClassificationGroup;
}
