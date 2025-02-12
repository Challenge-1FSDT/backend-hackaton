import { Injectable } from '@nestjs/common';

import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
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

    async isOwnAttendance(
        attendance: Attendance,
        user: Actor,
    ): Promise<boolean> {
        return attendance.student.user?.id === user.id;
    }
}
