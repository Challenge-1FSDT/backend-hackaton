import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Lecture } from '../../lecture/entities/lecture.entity';
import { School } from '../../school/entities/school.entity';
import { SchoolMember } from '../../school-member/entities/schoolMember.entity';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    startAt?: Date;

    @Column({ nullable: true })
    endAt?: Date;

    // * Relations
    @ManyToOne(() => School, { nullable: false })
    school: School;

    @ManyToOne(() => Lecture, (lecture) => lecture.attendances, {
        nullable: false,
    })
    lecture: Lecture;

    @ManyToOne(() => SchoolMember, { nullable: false })
    student: SchoolMember;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
