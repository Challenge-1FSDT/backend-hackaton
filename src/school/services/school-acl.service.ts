import { Injectable } from '@nestjs/common';

import { ERole } from '../../auth/constants/role.constant';
import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { SchoolMemberService } from '../../school-member/services/schoolMember.service';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { School } from '../entities/school.entity';

@Injectable()
export class SchoolAclService extends BaseAclService<
    ERole,
    School,
    AuthenticatedRequestContext
> {
    constructor(public readonly schoolMemberService: SchoolMemberService) {
        super();
        this.canDo(ERole.ADMIN, [Action.Manage]);
        this.canDo(
            ERole.USER,
            [Action.List, Action.Read],
            this.hasBasicAccessTo.bind(this),
        );
        this.canDo(
            ERole.USER,
            [Action.Update, Action.Delete],
            this.hasAdminAccessTo.bind(this),
        );
    }

    public async hasBasicAccessTo(
        school: School,
        actor: Actor,
        ctx?: AuthenticatedRequestContext,
    ): Promise<boolean> {
        return (
            !!ctx &&
            !!(
                ctx?.user?.schoolMember ||
                (await this.schoolMemberService.getOne(
                    ctx,
                    school.id,
                    actor.id,
                ))
            )
        );
    }

    public async hasAdminAccessTo(
        school: School,
        actor: Actor,
        ctx?: AuthenticatedRequestContext,
    ): Promise<boolean> {
        return (
            !!ctx &&
            [ESchoolRole.ADMIN].includes(
                (
                    ctx?.user?.schoolMember ||
                    (await this.schoolMemberService.getOne(
                        ctx,
                        school.id,
                        actor.id,
                    ))
                ).role,
            )
        );
    }
}
