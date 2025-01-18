import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { School } from '../entities/school.entity';

@Injectable()
export class SchoolRepository extends Repository<School> {
  constructor(private readonly dataSource: DataSource) {
    super(School, dataSource.createEntityManager());
  }

  public async getById(id: number): Promise<School> {
    const school = await this.findOne({ where: { id } });
    if (!school) {
      throw new NotFoundException();
    }

    return school;
  }
}
