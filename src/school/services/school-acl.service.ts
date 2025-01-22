import { Injectable } from '@nestjs/common';

import { ERole } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { School } from '../entities/school.entity';

@Injectable()
export class SchoolAclService extends BaseAclService<ERole, School> {
    constructor() {
        super();
        this.canDo(ERole.ADMIN, [Action.Manage]);
    }
}
