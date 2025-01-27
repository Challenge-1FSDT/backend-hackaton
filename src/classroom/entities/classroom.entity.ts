import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    Point,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { School } from '../../school/entities/school.entity';

@Entity('classrooms')
export class Classroom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column({ type: 'geometry', nullable: true })
    location?: Point;

    @Column({ nullable: true })
    locationRadius?: number;

    // * Relations
    @ManyToOne(() => School, { nullable: false })
    school: School;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
