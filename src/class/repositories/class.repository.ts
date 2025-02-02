import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Class } from '../entities/class.entity';

@Injectable()
export class ClassRepository extends Repository<Class> {
    constructor(private readonly dataSource: DataSource) {
        super(Class, dataSource.createEntityManager());
    }

    public async getById(id: number): Promise<Class> {
        const classEntity = await this.findOne({
            where: {
                id,
            },
        });
        if (!classEntity) {
            throw new NotFoundException();
        }

        return classEntity;
    }
}
