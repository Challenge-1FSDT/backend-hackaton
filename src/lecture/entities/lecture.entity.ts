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

import { Attendance } from '../../attendance/entities/attendance.entity';
import { Class } from '../../class/entities/class.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { School } from '../../school/entities/school.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('lectures')
export class Lecture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column()
    startAt: Date;

    @Column()
    endAt: Date;

    // * Relations
    @ManyToOne(() => School, (school) => school.classrooms)
    school: School;

    @ManyToOne(() => Subject, (subject) => subject.lectures)
    subject: Subject;

    @ManyToOne(() => Class, (schoolClass) => schoolClass.lectures)
    class: Class;

    @ManyToOne(() => Classroom, { nullable: true })
    classroom?: Classroom;

    @OneToMany(() => Attendance, (attendance) => attendance.lecture)
    attendances: Promise<Attendance[]>;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
