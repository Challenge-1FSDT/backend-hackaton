import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { SchoolMember } from '../entities/schoolMember.entity';

@Injectable()
export class SchoolMemberRepository extends Repository<SchoolMember> {
  constructor(private readonly dataSource: DataSource) {
    super(SchoolMember, dataSource.createEntityManager());
  }

  public async getById(id: number): Promise<SchoolMember> {
    const schoolMember = await this.findOne({ where: { id } });
    if (!schoolMember) {
      throw new NotFoundException();
    }

    return schoolMember;
  }
}
