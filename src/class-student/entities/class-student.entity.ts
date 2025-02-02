import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Class } from '../../class/entities/class.entity';
import { SchoolMember } from '../../schoolMember/entities/schoolMember.entity';

@Entity('class_students')
export class ClassStudent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Class, (classEntity) => classEntity.classStudents, {
        nullable: false,
    })
    class: Class;

    @ManyToOne(
        () => SchoolMember,
        (schoolMember) => schoolMember.classStudents,
        { nullable: false },
    )
    schoolMember: SchoolMember;
}
