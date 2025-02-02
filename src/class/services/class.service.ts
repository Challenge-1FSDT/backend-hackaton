import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { Class } from '../entities/class.entity';
import { ClassRepository } from '../repositories/class.repository';
import { ClassAclService } from './class-acl.service';

@Injectable()
export class ClassService {
    constructor(
        private readonly repository: ClassRepository,
        private readonly aclService: ClassAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassService.name);
    }

    public async getPaged(
        ctx: SchoolAuthenticatedRequestContext,
        where: FindOptionsWhere<Class>,
        pagination: PaginationParamsDto,
    ): Promise<PaginatedResult<Class>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.List);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const [data, count] = await this.repository.findAndCount({
            where: {
                ...where,
                school: {
                    id: ctx.schoolId,
                },
                ...(ctx.user.schoolMember?.role === ESchoolRole.TEACHER && {
                    lectures: {
                        subject: {
                            teachers: {
                                id: ctx.user.schoolMember.id,
                            },
                        },
                    },
                }),
                ...(ctx.user.schoolMember?.role === ESchoolRole.STUDENT && {
                    students: {
                        id: ctx.user.schoolMember.id,
                    },
                }),
            },
            take: pagination.limit,
            skip: pagination.offset,
        });

        return { data, count };
    }

    public async getById(
        ctx: SchoolAuthenticatedRequestContext,
        id: number,
    ): Promise<Class> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.Read);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const data = await this.repository.findOne({
            where: {
                id: id,
                school: {
                    id: ctx.schoolId,
                },
                ...(ctx.user.schoolMember?.role === ESchoolRole.TEACHER && {
                    lectures: {
                        subject: {
                            teachers: {
                                id: ctx.user.schoolMember.id,
                            },
                        },
                    },
                }),
                ...(ctx.user.schoolMember?.role === ESchoolRole.STUDENT && {
                    students: {
                        id: ctx.user.schoolMember.id,
                    },
                }),
            },
        });

        if (!data) {
            throw new NotFoundException();
        }

        return data;
    }
}
