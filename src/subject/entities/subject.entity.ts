import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Lecture } from '../../lecture/entities/lecture.entity';
import { School } from '../../school/entities/school.entity';
import { SchoolMember } from '../../schoolMember/entities/schoolMember.entity';

@Entity('subjects')
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column({ length: 2000, nullable: true })
    description?: string;

    // * Relations
    @ManyToOne(() => School, (school) => school.classrooms, { nullable: false })
    school: School;

    @ManyToMany(() => SchoolMember, (schoolMember) => schoolMember.subjects)
    @JoinTable({ name: 'subject_teachers' })
    teachers: Promise<SchoolMember[]>;

    @OneToMany(() => Lecture, (lecture) => lecture.subject)
    lectures: Promise<Lecture[]>;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
