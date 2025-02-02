import { Injectable } from '@nestjs/common';

import { ERole } from '../../auth/constants/role.constant';
import { SchoolMemberService } from '../../schoolMember/services/schoolMember.service';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { School } from '../entities/school.entity';

@Injectable()
export class SchoolAclService extends BaseAclService<ERole, School> {
    constructor(public readonly schoolMemberService: SchoolMemberService) {
        super();
        this.canDo(ERole.ADMIN, [Action.Manage]);
        this.canDo(
            ERole.USER,
            [Action.List, Action.Read],
            this.hasBasicAccessTo.bind(this),
        );
    }

    public async hasBasicAccessTo(
        school: School,
        actor: Actor,
        ctx?: AuthenticatedRequestContext,
    ): Promise<boolean> {
        return (
            !ctx?.user?.schoolMember ||
            !!(await this.schoolMemberService.getSchoolMember(
                ctx,
                school.id,
                actor.id,
            ))
        );
    }
}
