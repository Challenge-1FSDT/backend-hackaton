import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { School } from '../../school/entities/school.entity';
import { ESchoolRole } from '../constants/schoolRole.constant';

@Entity('school_members')
export class SchoolMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        enum: ESchoolRole,
        default: ESchoolRole.STUDENT,
    })
    role: ESchoolRole;

    @Column({ nullable: true, length: 100 })
    registration?: string;

    // * Relations
    @ManyToOne(() => School, (school) => school.members, { nullable: false })
    @JoinColumn()
    school: School;

    @ManyToOne(() => User, (user) => user.memberships, { nullable: true })
    @JoinColumn()
    user?: User;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
