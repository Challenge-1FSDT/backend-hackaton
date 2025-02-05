import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { ERole } from '../../auth/constants/role.constant';
import { Action } from '../../shared/acl/action.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateSubjectTeacherInput } from '../dtos/create-subject-teacher-input.dto';
import { SubjectTeacher } from '../entities/subject-teacher.entity';
import { SubjectTeacherRepository } from '../repositories/subject-teacher.repository';
import { SubjectTeacherAclService } from './subject-teacher-acl.service';

@Injectable()
export class SubjectTeacherService {
    constructor(
        private readonly repository: SubjectTeacherRepository,
        private readonly aclService: SubjectTeacherAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SubjectTeacherService.name);
    }

    public async getPaged(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<SubjectTeacher>,
        pagination: PaginationParamsDto,
        relations: FindOptionsRelations<SubjectTeacher>,
    ): Promise<PaginatedResult<SubjectTeacher>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const actor = ctx.user.schoolMember!;
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
            },
            take: pagination.limit,
            skip: pagination.offset,
            relations,
        });

        return { data, count };
    }

    public async getOne(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<SubjectTeacher>,
        relations: FindOptionsRelations<SubjectTeacher>,
    ): Promise<SubjectTeacher> {
        this.logger.log(ctx, `${this.getOne.name} was called`);

        const subjectTeacher = await this.repository.findOne({
            where: {
                ...where,
                school: {
                    id: schoolId,
                },
            },
            relations,
        });
        if (!subjectTeacher) {
            throw new NotFoundException();
        }

        const actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .canDoAction(Action.Read, subjectTeacher));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return subjectTeacher;
    }

    public async create(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        subjectId: number,
        create: CreateSubjectTeacherInput,
    ): Promise<SubjectTeacher> {
        this.logger.log(ctx, `${this.create.name} was called`);

        const actor = ctx.user.schoolMember!;
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
            subject: {
                id: subjectId,
                school: {
                    id: schoolId,
                },
            },
            schoolMember: {
                user: {
                    id: create.userId,
                },
                school: {
                    id: schoolId,
                },
            },
        } as DeepPartial<SubjectTeacher>);

        return data;
    }

    public async delete(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        subjectId: number,
        userId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.delete.name} was called`);

        const actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService.forActor(actor).canDoAction(Action.Delete));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.delete({
            school: {
                id: schoolId,
            },
            subject: {
                id: subjectId,
                school: {
                    id: schoolId,
                },
            },
            schoolMember: {
                user: {
                    id: userId,
                },
                school: {
                    id: schoolId,
                },
            },
        });
    }
}
