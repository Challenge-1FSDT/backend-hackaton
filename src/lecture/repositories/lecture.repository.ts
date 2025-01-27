import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Lecture } from '../entities/lecture.entity';

@Injectable()
export class LectureRepository extends Repository<Lecture> {
    constructor(private readonly dataSource: DataSource) {
        super(Lecture, dataSource.createEntityManager());
    }

    public async getById(id: number): Promise<Lecture> {
        const lecture = await this.findOne({ where: { id } });
        if (!lecture) {
            throw new NotFoundException();
        }

        return lecture;
    }
}
