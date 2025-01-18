import { Injectable } from '@nestjs/common';

import { BaseAclService } from '../../shared/acl/acl.service';
import { User } from '../entities/user.entity';
import { ERole } from './../../auth/constants/role.constant';
import { Action } from './../../shared/acl/action.constant';
import { Actor } from './../../shared/acl/actor.constant';

@Injectable()
export class UserAclService extends BaseAclService<User> {
  constructor() {
    super();
    // Admin can do all action
    this.canDo(ERole.ADMIN, [Action.Manage]);
    //user can read himself or any other user
    this.canDo(ERole.USER, [Action.Read]);
    // user can only update himself
    this.canDo(ERole.USER, [Action.Update], this.isUserItself);
  }

  isUserItself(resource: User, actor: Actor): boolean {
    return resource.id === actor.id;
  }
}
