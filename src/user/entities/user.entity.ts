import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

import { Article } from '../../article/entities/article.entity';
import { ERole } from '../../auth/constants/role.constant';
import { SchoolMember } from '../../schoolMember/entities/schoolMember.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200, nullable: false })
    firstName: string;

    @Column({ length: 200, nullable: true })
    lastName?: string;

    @Unique('email', ['email'])
    @Column({ length: 200, nullable: false })
    email: string;

    @Column({ length: 200, nullable: true })
    phone?: string;

    @Column({ length: 11, nullable: true })
    taxId?: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    dateOfBirth: Date;

    @Column({
        enum: ERole,
        default: ERole.USER,
        nullable: false,
    })
    role: ERole;

    @Column({ default: false })
    isDisabled: boolean;

    // * Relations
    @OneToMany(() => Article, (article) => article.author)
    articles: Article[];

    @OneToMany(() => SchoolMember, (schoolMember) => schoolMember.user)
    memberships: SchoolMember[];

    // * Timestamps
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true })
    deletedAt?: Date;
}
