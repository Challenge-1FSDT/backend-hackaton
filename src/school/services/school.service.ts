import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolOutput } from '../dtos/school-output.dto';
import { SchoolRepository } from '../repositories/school.repository';

@Injectable()
export class SchoolService {
    public constructor(
        private readonly repository: SchoolRepository,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolService.name);
    }

    async getSchools(
        ctx: any,
        limit: number,
        offset: number,
    ): Promise<{ schools: SchoolOutput[]; count: number }> {
        this.logger.log(ctx, `${this.getSchools.name} was called`);

        const [schools, count] = await this.repository.findAndCount({
            where: {},
            take: limit,
            skip: offset,
        });

        const schoolOutput = plainToInstance(SchoolOutput, schools, {
            excludeExtraneousValues: true,
        });

        return { schools: schoolOutput, count };
    }
}
