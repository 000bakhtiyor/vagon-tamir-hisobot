import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RepairClassification } from "./repair-classification.entity";

@Entity()
export class RepairClassificationGroup {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(
        () => RepairClassification,
        (classification) => classification.groups,
        { cascade: true }
    )
    @JoinTable({
        name: 'group_classifications', // pivot table
        joinColumn: { name: 'group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'classification_id', referencedColumnName: 'id' },
    })
    classifications: RepairClassification[];
}