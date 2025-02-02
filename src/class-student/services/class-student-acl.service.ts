import { Injectable } from '@nestjs/common';

import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { ClassStudent } from '../entities/class-student.entity';

@Injectable()
export class ClassStudentAclService extends BaseAclService<
    ESchoolRole,
    ClassStudent
> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.List, Action.Read]);
        this.canDo(ESchoolRole.STUDENT, [Action.List, Action.Read]);
    }
}
