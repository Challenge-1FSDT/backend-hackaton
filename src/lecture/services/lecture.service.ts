import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Actor } from 'src/shared/acl/actor.constant';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { ERole } from '../../auth/constants/role.constant';
import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { Action } from '../../shared/acl/action.constant';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateLectureInput } from '../dtos/create-lecture-input.dto';
import { UpdateLectureInput } from '../dtos/update-lecture-input.dto';
import { Lecture } from '../entities/lecture.entity';
import { LectureRepository } from '../repositories/lecture.repository';
import { LectureAclService } from './lectureAcl.service';

@Injectable()
export class LectureService {
    constructor(
        private readonly repository: LectureRepository,
        private readonly aclService: LectureAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(LectureService.name);
    }

    public async getLectures(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Lecture>,
        pagination: PaginationParamsDto,
    ): Promise<{ lectures: Lecture[]; count: number }> {
        this.logger.log(ctx, `${this.getLectures.name} was called`);

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

        const [lectures, count] = await this.repository.findAndCount({
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

        return { lectures, count };
    }

    public async getLecture(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
    ): Promise<Lecture> {
        this.logger.log(ctx, `${this.getLecture.name} was called`);

        const lecture = await this.repository.findOne({
            where: {
                id: lectureId,
                school: {
                    id: schoolId,
                },
            },
            relations: ['subject'],
        });
        if (!lecture) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .canDoAction(Action.Read, lecture));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return lecture;
    }

    public async createLecture(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        create: CreateLectureInput,
    ): Promise<Lecture> {
        this.logger.log(ctx, `${this.createLecture.name} was called`);

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
            subject: {
                id: create.subject,
                school: {
                    id: schoolId,
                },
            },
            class: {
                id: create.class,
                school: {
                    id: schoolId,
                },
            },
            classroom: {
                id: create.classroom,
                school: {
                    id: schoolId,
                },
            },
        } as DeepPartial<Lecture>);

        return data;
    }

    public async updateLecture(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
        update: UpdateLectureInput,
    ): Promise<Lecture> {
        this.logger.log(ctx, `${this.updateLecture.name} was called`);

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

        const lecture = await this.repository.findOne({
            where: {
                id: lectureId,
                school: {
                    id: schoolId,
                },
            },
        });
        if (!lecture) {
            throw new NotFoundException();
        }

        const data = await this.repository.save({
            ...lecture,
            ...(update.name && { name: update.name }),
            ...(update.startAt && { startAt: update.startAt }),
            ...(update.endAt && { endAt: update.endAt }),
            ...(update.classroom && {
                classroom: {
                    id: update.classroom,
                },
            }),
        } as DeepPartial<Lecture>);

        return data;
    }

    public async deleteLecture(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteLecture.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService.forActor(actor).canDoAction(Action.Delete));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.softDelete({
            school: {
                id: schoolId,
            },
            id: lectureId,
        });
    }
}
