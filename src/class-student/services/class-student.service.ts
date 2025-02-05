import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { SchoolMemberService } from 'src/schoolMember/services/schoolMember.service';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { ERole } from '../../auth/constants/role.constant';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateClassStudentInput } from '../dtos/create-class-student-input.dto';
import { ClassStudent } from '../entities/class-student.entity';
import { ClassStudentRepository } from '../repositories/class-student.repository';
import { ClassStudentAclService } from './class-student-acl.service';

@Injectable()
export class ClassStudentService {
    constructor(
        private readonly repository: ClassStudentRepository,
        private readonly aclService: ClassStudentAclService,
        private readonly schoolMemberService: SchoolMemberService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassStudentService.name);
    }

    public async getPaged(
        ctx: SchoolAuthenticatedRequestContext,
        where: FindOptionsWhere<ClassStudent>,
        pagination: PaginationParamsDto,
        relations: FindOptionsRelations<ClassStudent>,
    ): Promise<PaginatedResult<ClassStudent>> {
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
            },
            take: pagination.limit,
            skip: pagination.offset,
            relations: relations,
        });

        return { data, count };
    }

    public async getOne(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<ClassStudent>,
        relations: FindOptionsRelations<ClassStudent>,
    ): Promise<ClassStudent> {
        this.logger.log(ctx, `${this.getOne.name} was called`);

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
                ...where,
                school: {
                    id: schoolId,
                },
            },
            relations,
        });
        if (!data) {
            throw new NotFoundException();
        }

        return data;
    }

    public async createStudent(
        ctx: SchoolAuthenticatedRequestContext,
        classId: number,
        create: CreateClassStudentInput,
    ): Promise<ClassStudent> {
        this.logger.log(ctx, `${this.createStudent.name} was called`);

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

        const schoolMember = await this.schoolMemberService.getSchoolMember(
            ctx,
            ctx.schoolId,
            create.userId,
        );
        const data = await this.repository.save({
            schoolMember: {
                id: schoolMember.id,
            },
            class: {
                id: classId,
            },
        });

        return data;
    }

    public async deleteByUserId(
        ctx: SchoolAuthenticatedRequestContext,
        classId: number,
        userId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteByUserId.name} was called`);

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

        const schoolMember = await this.schoolMemberService.getSchoolMember(
            ctx,
            ctx.schoolId,
            userId,
        );
        await this.repository.softDelete({
            class: {
                id: classId,
            },
            schoolMember: {
                id: schoolMember.id,
            },
        });
    }
}
