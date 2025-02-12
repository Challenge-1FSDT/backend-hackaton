import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';

import { ERole } from '../../auth/constants/role.constant';
import { LectureService } from '../../lecture/services/lecture.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { AttendanceAclService } from './attendanceAcl.service';

@Injectable()
export class AttendanceService {
    constructor(
        private readonly lectureService: LectureService,
        private readonly attendanceAclService: AttendanceAclService,
        private readonly repository: AttendanceRepository,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(AttendanceService.name);
    }

    public async getAttendanceList(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
        limit: number,
        offset: number,
    ): Promise<{ attendances: Attendance[]; count: number }> {
        this.logger.log(ctx, `${this.getAttendanceList.name} was called`);

        const lecture = await this.lectureService.getLecture(
            ctx,
            schoolId,
            lectureId,
        );
        const [attendances, count] = await this.repository.findAndCount({
            where: {
                school: { id: schoolId },
                lecture: { id: lecture.id },
            },
            take: limit,
            skip: offset,
        });

        return { attendances, count };
    }

    public async getAttendance(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
        userId: number,
    ): Promise<Attendance> {
        this.logger.log(ctx, `${this.getAttendance.name} was called`);

        const lecture = await this.lectureService.getLecture(
            ctx,
            schoolId,
            lectureId,
        );
        const attendance = await this.repository.findOne({
            where: {
                school: { id: schoolId },
                lecture: { id: lecture.id },
                student: {
                    user: { id: userId },
                },
            },
            relations: ['student.user'],
        });
        if (!attendance) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.attendanceAclService
                .forActor(actor)
                .canDoAction(Action.Read, attendance));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return attendance;
    }

    public async createOrUpdateAttendance(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
        userId: number,
    ) {
        this.logger.log(
            ctx,
            `${this.createOrUpdateAttendance.name} was called`,
        );

        const lecture = await this.lectureService.getLecture(
            ctx,
            schoolId,
            lectureId,
        );

        const now = new Date();
        let attendance = await this.repository.findOne({
            where: {
                school: { id: schoolId },
                lecture: { id: lectureId },
                student: { user: { id: userId } },
            },
            relations: ['student.user'],
        });

        const startDiff = DateTime.fromJSDate(lecture.startAt)
            .diffNow('minutes')
            .negate()
            .toObject().minutes!;
        const endDiff = DateTime.fromJSDate(lecture.endAt)
            .diffNow('minutes')
            .negate()
            .toObject().minutes!;

        const actor: Actor = ctx.user.schoolMember!;
        if (
            // Min 5m before class starts, and 10m after
            !attendance &&
            startDiff >= -5 &&
            startDiff <= 10
        ) {
            const create = plainToInstance(Attendance, {
                school: { id: schoolId },
                lecture: { id: lectureId },
                student: { user: { id: userId } },
                startAt: now,
            });

            const isAllowed =
                ctx.user.role === ERole.ADMIN ||
                (await this.attendanceAclService
                    .forActor(actor)
                    .canDoAction(Action.Create, create));
            if (!isAllowed) {
                throw new ForbiddenException();
            }

            attendance = await this.repository.save(create);
        } else if (
            // Min 10m before class ends, and 5m after
            !!attendance &&
            !attendance.endAt &&
            endDiff >= -10 &&
            endDiff <= 5
        ) {
            const isAllowed =
                ctx.user.role === ERole.ADMIN ||
                (await this.attendanceAclService
                    .forActor(actor)
                    .canDoAction(Action.Update, attendance));
            if (!isAllowed) {
                throw new ForbiddenException();
            }

            attendance = await this.repository.save({
                ...attendance,
                endAt: now,
            });
        } else {
            throw new UnauthorizedException(
                `No valid attendance within the time restriction`,
            );
        }

        return attendance;
    }
}
