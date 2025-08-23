import { WagonDepot } from "src/wagon-depots/entities/wagon-depot.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CreateWagon {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    number: string;

    @Column()
    createdAt: Date;
    
    @ManyToOne(() => WagonDepot, (wagonDepot) => wagonDepot.createWagons, { eager: true })
    wagonDepot: WagonDepot;
}
