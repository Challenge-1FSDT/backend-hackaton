import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ClassStudent } from '../entities/class-student.entity';

@Injectable()
export class ClassStudentRepository extends Repository<ClassStudent> {
    constructor(private readonly dataSource: DataSource) {
        super(ClassStudent, dataSource.createEntityManager());
    }

    public async getByUserId(
        classId: number,
        userId: number,
    ): Promise<ClassStudent> {
        const student = await this.findOne({
            where: {
                schoolMember: {
                    user: {
                        id: userId,
                    },
                },
                class: {
                    id: classId,
                },
            },
        });
        if (!student) {
            throw new NotFoundException();
        }

        return student;
    }
}
