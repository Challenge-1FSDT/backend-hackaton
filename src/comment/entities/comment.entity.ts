import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Lecture } from '../../lecture/entities/lecture.entity';
import { School } from '../../school/entities/school.entity';
import { SchoolMember } from '../../schoolMember/entities/schoolMember.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    post: string;

    // * Relations
    @ManyToOne(() => School, { nullable: false })
    @JoinColumn()
    school: School;

    @ManyToOne(() => Lecture, { nullable: false })
    @JoinColumn()
    lecture: Lecture;

    @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
    @JoinColumn()
    parent: Comment;

    @OneToMany(() => Comment, (comment) => comment.parent)
    children: Comment[];

    @ManyToOne(() => SchoolMember, { eager: true, nullable: false })
    @JoinColumn()
    author: SchoolMember;

    // * Timestamps
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
