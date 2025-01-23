import { Transform } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    Point,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

import { Classroom } from '../../classroom/entities/classroom.entity';
import { SchoolMember } from '../../schoolMember/entities/schoolMember.entity';

@Entity('schools')
export class School {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column({ length: 200 })
    fantasyName?: string;

    @Unique('taxId', ['taxId'])
    @Column({ length: 14 })
    taxId: string;

    @Column({ length: 200 })
    address: string;

    @Column({ length: 200 })
    city: string;

    @Column({ length: 2 })
    state: string;

    @Column({ type: 'geometry', spatialFeatureType: 'Point' })
    @Transform(
        ({ value }) => ({ coordinates: value, type: 'Point' }) as Point,
        {
            toClassOnly: true,
        },
    )
    location: Point;

    @Column({ default: 50 })
    locationRadius: number;

    // * Relations
    @OneToMany(() => Classroom, (classroom) => classroom.school)
    classrooms: Promise<Classroom[]>;

    @OneToMany(() => SchoolMember, (schoolMember) => schoolMember.school)
    members: Promise<SchoolMember[]>;

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
