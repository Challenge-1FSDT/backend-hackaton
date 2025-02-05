import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectRepository extends Repository<Subject> {
    constructor(private readonly dataSource: DataSource) {
        super(Subject, dataSource.createEntityManager());
    }
}
