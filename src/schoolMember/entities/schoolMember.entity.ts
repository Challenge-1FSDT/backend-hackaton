import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Class } from '../../class/entities/class.entity';
import { School } from '../../school/entities/school.entity';
import { Subject } from '../../subject/entities/subject.entity';
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

    // * Relations
    @ManyToOne(() => School, (school) => school.members)
    school: School;

    @ManyToOne(() => User, (user) => user.memberships)
    user: User;

    @ManyToMany(() => Class, (schoolClass) => schoolClass.students)
    classes: Promise<Class[]>;

    @ManyToMany(() => Subject, (subject) => subject.teachers)
    subjects: Promise<Subject[]>;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
