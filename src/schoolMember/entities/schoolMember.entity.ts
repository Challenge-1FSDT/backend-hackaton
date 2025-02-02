import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ClassStudent } from '../../class-student/entities/class-student.entity';
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

    @Column({ nullable: true, length: 100 })
    registration?: string;

    // * Relations
    @ManyToOne(() => School, (school) => school.members, { nullable: false })
    school: School;
    @Column({ nullable: false })
    schoolId: number;

    @ManyToOne(() => User, (user) => user.memberships, { nullable: true })
    user?: User;
    @Column({ nullable: true })
    userId?: number;

    @OneToMany(() => ClassStudent, (classStudent) => classStudent.schoolMember)
    classStudents: Promise<ClassStudent[]>;

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
