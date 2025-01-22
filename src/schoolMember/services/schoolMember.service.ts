import { Injectable } from '@nestjs/common';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { SchoolMember } from '../entities/schoolMember.entity';
import { SchoolMemberRepository } from '../repositories/schoolMember.repository';

@Injectable()
export class SchoolMemberService {
    public constructor(
        private readonly repository: SchoolMemberRepository,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolMemberService.name);
    }

    public async getSchoolMember(
        ctx: RequestContext,
        schoolId: number,
        userId: number,
    ): Promise<SchoolMember | null> {
        this.logger.log(ctx, `${this.getSchoolMember.name} was called`);

        const member = await this.repository.findOne({
            where: { user: { id: userId }, school: { id: schoolId } },
        });

        return member;
    }
}
