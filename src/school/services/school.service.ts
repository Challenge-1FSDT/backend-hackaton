import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { SchoolMemberService } from '../../schoolMember/services/schoolMember.service';
import { SchoolMemberAclService } from '../../schoolMember/services/schoolMember-acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateSchoolInput } from '../dtos/create-school-input.dto';
import { School } from '../entities/school.entity';
import { SchoolRepository } from '../repositories/school.repository';
import { SchoolAclService } from './school-acl.service';

@Injectable()
export class SchoolService {
    public constructor(
        private readonly repository: SchoolRepository,
        private readonly schoolMemberService: SchoolMemberService,
        private readonly aclService: SchoolAclService,
        private readonly schoolMemberAclService: SchoolMemberAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolService.name);
    }

    async getSchools(
        ctx: RequestContext,
        limit: number,
        offset: number,
    ): Promise<{ schools: School[]; count: number }> {
        this.logger.log(ctx, `${this.getSchools.name} was called`);

        const [schools, count] = await this.repository.findAndCount({
            where: {
                members: {
                    id: ctx.user!.id,
                },
            },
            take: limit,
            skip: offset,
        });

        return { schools, count };
    }

    async getSchool(ctx: RequestContext, schoolId: number): Promise<School> {
        this.logger.log(ctx, `${this.getSchool.name} was called`);

        const school = await this.repository.getById(schoolId);

        const actor: Actor = ctx.user!;
        let isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.Read, school);
        if (!isAllowed) {
            const memberActor: Actor | null =
                await this.schoolMemberService.getSchoolMember(
                    ctx,
                    schoolId,
                    ctx.user!.id,
                );
            if (memberActor) {
                isAllowed = await this.schoolMemberAclService
                    .forActor(memberActor)
                    .canDoAction(Action.Read, school);
            }
        }
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return school;
    }

    async createSchool(ctx: any, create: CreateSchoolInput): Promise<School> {
        this.logger.log(ctx, `${this.createSchool.name} was called`);

        const exists = await this.repository.existsBy({ taxId: create.taxId });
        if (exists) {
            throw new UnprocessableEntityException();
        }

        const school = plainToInstance(School, create);

        const actor: Actor = ctx.user!;
        const isAllowed = this.aclService
            .forActor(actor)
            .canDoAction(Action.Create);
        if (!isAllowed) {
            throw new UnauthorizedException();
        }

        const savedSchool = await this.repository.save(school);

        return savedSchool;
    }
}
