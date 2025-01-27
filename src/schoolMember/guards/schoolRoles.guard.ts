import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ERole } from '../../auth/constants/role.constant';
import { ESchoolRole } from '../constants/schoolRole.constant';
import { SCHOOL_ROLES_KEY } from '../decorators/schoolRole.decorator';
import { SchoolMemberService } from '../services/schoolMember.service';

@Injectable()
export class SchoolRolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly schoolMemberService: SchoolMemberService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<ESchoolRole[]>(
            SCHOOL_ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest<Request>();

        if (
            user &&
            (user.role === ERole.ADMIN ||
                (user.schoolMember &&
                    requiredRoles.some(
                        (role) => role === user.schoolMember!.role,
                    )))
        ) {
            return true;
        }

        throw new UnauthorizedException(
            `School member with role ${user?.schoolMember?.role ?? 'NONE'} does not have access to this route with roles ${requiredRoles}`,
        );
    }
}
