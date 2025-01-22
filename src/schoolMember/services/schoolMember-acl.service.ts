import { Injectable } from '@nestjs/common';

import { School } from '../../school/entities/school.entity';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { ESchoolRole } from '../constants/schoolRole.constant';

@Injectable()
export class SchoolMemberAclService extends BaseAclService<
    ESchoolRole,
    School
> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.Read]);
        this.canDo(ESchoolRole.STUDENT, [Action.Read]);
    }
}
