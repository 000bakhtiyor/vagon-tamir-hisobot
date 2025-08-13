import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { WagonDepot } from 'src/wagon-depots/entities/wagon-depot.entity';
import { RolesEnum } from 'src/common/enums/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    username: string;

    @Column({ length: 100 })
    password: string;

    @Column({ nullable: true, length: 100 })
    fullName?: string;

    @Column({ 
        type: 'enum',
        enum: RolesEnum,
        default: RolesEnum.VIEWER
     })
    role: RolesEnum;
    
    @Column({ nullable: true })
    refreshToken?: string;

    @ManyToMany(() => WagonDepot, (depot) => depot.admins)
    depots: WagonDepot[];

    @BeforeInsert()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    @BeforeUpdate()
    async hashPasswordUpdate() {
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
