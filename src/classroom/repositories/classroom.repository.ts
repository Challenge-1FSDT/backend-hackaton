import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Classroom } from '../entities/classroom.entity';

@Injectable()
export class ClassroomRepository extends Repository<Classroom> {
    constructor(private dataSource: DataSource) {
        super(Classroom, dataSource.createEntityManager());
    }
}
