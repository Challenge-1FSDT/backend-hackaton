import { ERole } from './../../auth/constants/role.constant';
import { AclRule, RuleCallback } from './acl-rule.constant';
import { Action } from './action.constant';
import { Actor } from './actor.constant';

export class BaseAclService<Resource> {
  /**
   * ACL rules
   */
  protected aclRules: AclRule<Resource>[] = [];

  /**
   * Set ACL rule for a role
   */
  protected canDo(
    role: ERole,
    actions: Action[],
    ruleCallback?: RuleCallback<Resource>,
  ): void {
    ruleCallback
      ? this.aclRules.push({ role, actions, ruleCallback })
      : this.aclRules.push({ role, actions });
  }

  /**
   * create user specific acl object to check ability to perform any action
   */
  public forActor = (actor: Actor): any => {
    return {
      canDoAction: (action: Action, resource?: Resource) => {
        //find all rules for given user role
        const aclRules = this.aclRules.filter(
          (rule) => rule.role === actor.role,
        );

        //for each rule, check action permission
        return aclRules.some((aclRule) => {
          //check action permission
          const hasActionPermission =
            aclRule.actions.includes(action) ||
            aclRule.actions.includes(Action.Manage);

          //check for custom `ruleCallback` callback
          if (!aclRule.ruleCallback) {
            return hasActionPermission;
          } else {
            if (!resource) {
              throw new Error('Resource is required for ruleCallback');
            }

            return hasActionPermission && aclRule.ruleCallback(resource, actor);
          }
        });
      },
    };
  };
}
