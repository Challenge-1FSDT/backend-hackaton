import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { AppLogger } from '../../shared/logger/logger.service';
import { Attendance } from '../entities/attendance.entity';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { LectureService } from '../../lecture/services/lecture.service';
import { DateTime } from 'luxon';
import { plainToInstance } from 'class-transformer';
import { Actor } from '../../shared/acl/actor.constant';
import { AttendanceAclService } from './attendanceAcl.service';
import { ERole } from '../../auth/constants/role.constant';
import { Action } from '../../shared/acl/action.constant';

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
        ctx: AuthenticatedRequestContext,
        lectureId: number,
        limit: number,
        offset: number,
    ): Promise<{ attendances: Attendance[]; count: number }> {
        this.logger.log(ctx, `${this.getAttendanceList.name} was called`);

        const lecture = await this.lectureService.getLecture(ctx, lectureId);
        const [attendances, count] = await this.repository.findAndCount({
            where: {
                school: { id: ctx.schoolId! },
                lecture: { id: lectureId },
            },
            take: limit,
            skip: offset,
        });

        return { attendances, count };
    }

    public async getAttendance(
        ctx: AuthenticatedRequestContext,
        lectureId: number,
        attendanceId: number,
    ): Promise<Attendance> {
        this.logger.log(ctx, `${this.getAttendance.name} was called`);

        const lecture = await this.lectureService.getLecture(ctx, lectureId);
        const attendance = await this.repository.findOne({
            where: {
                school: { id: ctx.schoolId! },
                lecture: { id: lectureId },
                id: attendanceId,
            },
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
        ctx: AuthenticatedRequestContext,
        lectureId: number,
        studentId: number,
    ) {
        this.logger.log(
            ctx,
            `${this.createOrUpdateAttendance.name} was called`,
        );

        const lecture = await this.lectureService.getLecture(ctx, lectureId);

        const now = new Date();
        let attendance = await this.repository.findOne({
            where: {
                school: { id: ctx.schoolId! },
                lecture: { id: lectureId },
                student: { id: studentId },
            },
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
                school: { id: ctx.schoolId! },
                student: { id: studentId },
                lecture: { id: lectureId },
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
