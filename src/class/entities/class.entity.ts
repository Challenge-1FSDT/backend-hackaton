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
import { SchoolMember } from '../../school/entities/schoolMember.entity';

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
  @ManyToOne(() => School, (school) => school.classrooms)
  school: School;

  @ManyToMany(() => SchoolMember, (schoolMember) => schoolMember.classes)
  @JoinTable({ name: 'class_students' })
  students: Promise<SchoolMember[]>;

  @OneToMany(() => Lecture, (lecture) => lecture.class)
  lectures: Promise<Lecture[]>;

  // * Timestamps
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;
}
