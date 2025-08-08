import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

    @Column({ default: 'viewer' })
    role: 'admin' | 'viewer' | 'superadmin';

    @Column({ nullable: true })
    vchdId?: string;    
    
    @Column({ nullable: true })
    refreshToken?: string;

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
