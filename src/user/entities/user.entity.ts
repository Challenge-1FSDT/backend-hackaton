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
import { SchoolMember } from '../../school/entities/schoolMember.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  firstName: string;

  @Column({ length: 200, nullable: true })
  lastName?: string;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @Column({ length: 200, nullable: true })
  phone?: string;

  @Column({ length: 11, nullable: true })
  taxId?: string;

  @Column()
  password: string;

  @Column({
    enum: ERole,
    default: ERole.USER,
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
