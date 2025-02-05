import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { School } from '../../school/entities/school.entity';
import { SchoolMember } from '../../schoolMember/entities/schoolMember.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('subject_teachers')
export class SubjectTeacher {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => School, { nullable: false })
    @JoinColumn()
    school: School;

    @ManyToOne(() => Subject, (subject) => subject.subjectTeachers, {
        nullable: false,
    })
    @JoinColumn()
    subject: Subject;

    @ManyToOne(() => SchoolMember, { nullable: false })
    @JoinColumn()
    schoolMember: SchoolMember;
}
