import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Class } from '../entities/class.entity';

export class ClassAclService extends BaseAclService<ESchoolRole, Class> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.Read, Action.List]);
        this.canDo(ESchoolRole.STUDENT, [Action.Read, Action.List]);
    }
}
