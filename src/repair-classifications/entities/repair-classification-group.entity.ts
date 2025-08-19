import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RepairClassification } from "./repair-classification.entity";

@Entity()
export class RepairClassificationGroup {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => RepairClassification, classification => classification.group)
    classifications: RepairClassification[];
}