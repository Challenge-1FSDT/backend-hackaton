import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ERole } from '../constants/role.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ERole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
