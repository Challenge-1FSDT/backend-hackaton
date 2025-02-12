import { Injectable } from '@nestjs/common';

import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { ESchoolRole } from '../constants/schoolRole.constant';
import { SchoolMember } from '../entities/schoolMember.entity';

@Injectable()
export class SchoolMemberAclService extends BaseAclService<
    ESchoolRole,
    SchoolMember
> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.List, Action.Read]);
        this.canDo(ESchoolRole.STUDENT, [Action.Read], this.isSelf);
    }

    public isSelf(schoolMember: SchoolMember, actor: Actor): boolean {
        return schoolMember.user!.id === actor.id;
    }
}
