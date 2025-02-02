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

import { ClassStudent } from '../../class-student/entities/class-student.entity';
import { Lecture } from '../../lecture/entities/lecture.entity';
import { School } from '../../school/entities/school.entity';

@Entity('classes')
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column()
    startAt: Date;

    @Column()
    endAt: Date;

    // * Relations
    @ManyToOne(() => School, (school) => school.classrooms, { nullable: false })
    school: School;

    @OneToMany(() => ClassStudent, (classStudent) => classStudent.class, {
        cascade: ['soft-remove'],
    })
    classStudents: Promise<ClassStudent[]>;

    @OneToMany(() => Lecture, (lecture) => lecture.class, {
        cascade: ['soft-remove'],
    })
    lectures: Promise<Lecture[]>;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
