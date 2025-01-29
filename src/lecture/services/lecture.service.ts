import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Actor } from 'src/shared/acl/actor.constant';
import { FindOptionsWhere } from 'typeorm';

import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { Action } from '../../shared/acl/action.constant';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
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
        ctx: AuthenticatedRequestContext,
        where: FindOptionsWhere<Lecture>,
        pagination: PaginationParamsDto,
    ): Promise<{ lectures: Lecture[]; count: number }> {
        this.logger.log(ctx, `${this.getLectures.name} was called`);

        const [lectures, count] = await this.repository.findAndCount({
            where: {
                ...where,
                school: {
                    id: ctx.schoolId!,
                },
                ...(ctx.user.schoolMember?.role === ESchoolRole.TEACHER && {
                    subject: {
                        teachers: {
                            id: ctx.user.schoolMember!.id,
                        },
                    },
                }),
                ...(ctx.user.schoolMember?.role === ESchoolRole.STUDENT && {
                    class: {
                        students: {
                            id: ctx.user.schoolMember!.id,
                        },
                    },
                }),
            },
            take: pagination.limit,
            skip: pagination.offset,
        });

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.List);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return { lectures, count };
    }

    public async getLecture(
        ctx: AuthenticatedRequestContext,
        lectureId: number,
    ): Promise<Lecture> {
        this.logger.log(ctx, `${this.getLecture.name} was called`);

        const lecture = await this.repository.findOne({
            where: { id: lectureId },
            relations: ['subject'],
        });
        if (!lecture) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.Read, lecture);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return lecture;
    }
}
