import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { SubjectTeacher } from '../entities/subject-teacher.entity';

@Injectable()
export class SubjectTeacherRepository extends Repository<SubjectTeacher> {
    constructor(private readonly dataSource: DataSource) {
        super(SubjectTeacher, dataSource.createEntityManager());
    }
}
