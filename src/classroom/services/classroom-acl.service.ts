import { Injectable } from '@nestjs/common';

import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { Classroom } from '../entities/classroom.entity';

@Injectable()
export class ClassroomAclService extends BaseAclService<
    ESchoolRole,
    Classroom,
    SchoolAuthenticatedRequestContext
> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.List, Action.Read]);
        this.canDo(ESchoolRole.STUDENT, [Action.List, Action.Read]);
    }
}
