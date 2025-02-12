import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { ERole } from '../../auth/constants/role.constant';
import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateClassInput } from '../dtos/create-class-input.dto';
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
        schoolId: number,
        where: FindOptionsWhere<Class>,
        pagination: PaginationParamsDto,
    ): Promise<PaginatedResult<Class>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .withContext(ctx)
                .canDoAction(Action.List));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const [data, count] = await this.repository.findAndCount({
            where: {
                ...where,
                school: {
                    id: schoolId,
                },
                ...(ctx.user.schoolMember?.role === ESchoolRole.TEACHER && {
                    lectures: {
                        subject: {
                            subjectTeachers: {
                                schoolMember: {
                                    id: ctx.user.schoolMember.id,
                                },
                            },
                        },
                    },
                }),
                ...(ctx.user.schoolMember?.role === ESchoolRole.STUDENT && {
                    classStudents: {
                        schoolMember: {
                            id: ctx.user.schoolMember.id,
                        },
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
        schoolId: number,
        id: number,
    ): Promise<Class> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .withContext(ctx)
                .canDoAction(Action.Read));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const data = await this.repository.findOne({
            where: {
                id: id,
                school: {
                    id: schoolId,
                },
                ...(ctx.user.schoolMember?.role === ESchoolRole.TEACHER && {
                    lectures: {
                        subject: {
                            subjectTeachers: {
                                schoolMember: {
                                    id: ctx.user.schoolMember.id,
                                },
                            },
                        },
                    },
                }),
                ...(ctx.user.schoolMember?.role === ESchoolRole.STUDENT && {
                    classStudents: {
                        schoolMember: {
                            id: ctx.user.schoolMember.id,
                        },
                    },
                }),
            },
        });

        if (!data) {
            throw new NotFoundException();
        }

        return data;
    }

    public async createClass(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        create: CreateClassInput,
    ): Promise<Class> {
        this.logger.log(ctx, `${this.createClass.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .withContext(ctx)
                .canDoAction(Action.Create));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const data = await this.repository.save({
            ...create,
            school: {
                id: schoolId,
            },
        });

        return data;
    }

    public async deleteClass(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        classId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteClass.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .withContext(ctx)
                .canDoAction(Action.Delete));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.softDelete({
            school: {
                id: schoolId,
            },
            id: classId,
        });
    }
}
