import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ERole } from 'src/auth/constants/role.constant';
import { Action } from 'src/shared/acl/action.constant';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateClassroomInput } from '../dtos/create-classroom-input.dto';
import { UpdateClassroomInput } from '../dtos/update-classroom-input.dto';
import { Classroom } from '../entities/classroom.entity';
import { ClassroomRepository } from '../repositories/classroom.repository';
import { ClassroomAclService } from './classroom-acl.service';

@Injectable()
export class ClassroomService {
    public constructor(
        private readonly repository: ClassroomRepository,
        private readonly aclService: ClassroomAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassroomService.name);
    }

    async getPaged(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Classroom>,
        pagination: PaginationParamsDto,
        relations: FindOptionsRelations<Classroom>,
    ): Promise<PaginatedResult<Classroom>> {
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

    async getOne(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Classroom>,
        relations: FindOptionsRelations<Classroom>,
    ): Promise<Classroom> {
        this.logger.log(ctx, `${this.getOne.name} was called`);

        const classroom = await this.repository.findOne({
            where: {
                ...where,
                school: {
                    id: schoolId,
                },
            },
            relations,
        });
        if (!classroom) {
            throw new NotFoundException();
        }

        return classroom;
    }

    async update(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        classroomId: number,
        dto: UpdateClassroomInput,
    ): Promise<Classroom> {
        this.logger.log(ctx, `${this.update.name} was called`);

        const classroom = await this.repository.findOne({
            where: {
                id: classroomId,
                school: {
                    id: schoolId,
                },
            },
        });
        if (!classroom) {
            throw new NotFoundException();
        }

        const actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .canDoAction(Action.Update, classroom));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return this.repository.save({
            ...classroom,
            ...dto,
        });
    }

    async create(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        dto: CreateClassroomInput,
    ): Promise<Classroom> {
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

        const classroom = this.repository.create({
            ...dto,
            school: {
                id: schoolId,
            },
        } as Classroom);

        return this.repository.save(classroom);
    }

    async delete(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        classroomId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.delete.name} was called`);

        const classroom = await this.repository.findOne({
            where: {
                id: classroomId,
                school: {
                    id: schoolId,
                },
            },
        });
        if (!classroom) {
            throw new NotFoundException();
        }

        const actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .canDoAction(Action.Delete, classroom));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.softDelete(classroomId);
    }
}
