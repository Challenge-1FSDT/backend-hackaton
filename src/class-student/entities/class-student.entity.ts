import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Class } from '../../class/entities/class.entity';
import { School } from '../../school/entities/school.entity';
import { SchoolMember } from '../../school-member/entities/schoolMember.entity';

@Entity('class_students')
export class ClassStudent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => School, { nullable: false })
    @JoinColumn()
    school: School;

    @ManyToOne(() => Class, (classEntity) => classEntity.classStudents, {
        nullable: false,
    })
    @JoinColumn()
    class: Class;

    @ManyToOne(() => SchoolMember, { nullable: false })
    @JoinColumn()
    schoolMember: SchoolMember;
}
