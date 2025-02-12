import { Injectable } from '@nestjs/common';

import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectAclService extends BaseAclService<ESchoolRole, Subject> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [
            Action.Read,
            Action.List,
            Action.Update,
        ]);
        this.canDo(ESchoolRole.STUDENT, [Action.Read, Action.List]);
    }
}
