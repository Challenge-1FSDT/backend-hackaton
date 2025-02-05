import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from 'src/shared/acl/actor.constant';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { ERole } from '../../auth/constants/role.constant';
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { Action } from '../../shared/acl/action.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateSubjectInput } from '../dtos/create-subject-input.dto';
import { UpdateSubjectInput } from '../dtos/update-subject-input.dto';
import { Subject } from '../entities/subject.entity';
import { SubjectRepository } from '../repositories/subject.repository';
import { SubjectAclService } from './subject-acl.service';

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(SubjectRepository)
        private readonly repository: SubjectRepository,
        private readonly aclService: SubjectAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SubjectService.name);
    }

    public async getPaged(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Subject>,
        pagination: PaginationParamsDto,
    ): Promise<PaginatedResult<Subject>> {
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
                    id: schoolId!,
                },
                ...(ctx.user.schoolMember?.role === ESchoolRole.TEACHER && {
                    subjectTeachers: {
                        schoolMember: {
                            id: ctx.user.schoolMember.id,
                        },
                    },
                }),
                ...(ctx.user.schoolMember?.role === ESchoolRole.STUDENT && {
                    class: {
                        classStudents: {
                            schoolMember: {
                                id: ctx.user.schoolMember!.id,
                            },
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
        subjectId: number,
    ): Promise<Subject> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const subject = await this.repository.findOne({
            where: {
                id: subjectId,
                school: {
                    id: schoolId,
                },
            },
            relations: ['school'],
        });
        if (!subject) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .canDoAction(Action.Read, subject));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return subject;
    }

    public async create(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        create: CreateSubjectInput,
    ): Promise<Subject> {
        this.logger.log(ctx, `${this.create.name} was called`);

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
        } as DeepPartial<Subject>);

        return data;
    }

    public async update(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        subjectId: number,
        update: UpdateSubjectInput,
    ): Promise<Subject> {
        this.logger.log(ctx, `${this.update.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .withContext(ctx)
                .canDoAction(Action.Update));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.update(
            { id: subjectId, school: { id: schoolId } },
            update,
        );
        return this.getById(ctx, schoolId, subjectId);
    }

    public async delete(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        subjectId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.delete.name} was called`);

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

        await this.repository.delete({
            school: {
                id: schoolId,
            },
            id: subjectId,
        });
    }
}
