import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vchd } from 'src/vchds/entities/vchd.entity';

@Entity()
export class Vagon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    number: string;

    @Column({nullable: true})
    description?: string;

    @Column({nullable: true})
    type?: string;

    @Column()
    importedTime: Date;

    @Column({ type:'date', nullable: true })
    timeTakenOut?: Date;

    @ManyToOne(() => Vchd, (vchd) => vchd.vagons, { eager: true })
    vchd: Vchd;
}
