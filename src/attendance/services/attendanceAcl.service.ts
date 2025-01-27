import { Injectable } from '@nestjs/common';
import { BaseAclService } from '../../shared/acl/acl.service';
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceAclService extends BaseAclService<
    ESchoolRole,
    Attendance
> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.Read, Action.List]);
        this.canDo(
            ESchoolRole.STUDENT,
            [Action.Read, Action.Update, Action.Create],
            this.isOwnAttendance,
        );
    }

    isOwnAttendance(attendance: Attendance, user: Actor): boolean {
        return attendance.student.id === user.id;
    }
}
