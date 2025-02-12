import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ESchoolRole } from '../constants/schoolRole.constant';

export const SCHOOL_ROLES_KEY = 'school_roles';
export const SchoolRoles = (...roles: ESchoolRole[]): CustomDecorator<string> =>
    SetMetadata(SCHOOL_ROLES_KEY, roles);
