import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Lecture } from '../../lecture/entities/lecture.entity';
import { School } from '../../school/entities/school.entity';
import { SubjectTeacher } from '../../subject-teacher/entities/subject-teacher.entity';

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

    @OneToMany(() => SubjectTeacher, (schoolMember) => schoolMember.subject)
    subjectTeachers: Promise<SubjectTeacher[]>;

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
