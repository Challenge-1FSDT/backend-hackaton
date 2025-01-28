import { AuthenticatedRequestContext } from '../request-context/request-context.dto';
import { AclRule, RuleCallback } from './acl-rule.constant';
import { Action } from './action.constant';
import { Actor } from './actor.constant';

export class BaseAclService<RoleEnum, Resource> {
    /**
     * ACL rules
     */
    protected aclRules: AclRule<RoleEnum, Resource>[] = [];

    /**
     * Set ACL rule for a role
     */
    protected canDo(
        role: RoleEnum,
        actions: Action[],
        ...ruleCallback: RuleCallback<Resource>[]
    ): void {
        this.aclRules.push({
            role,
            actions,
            ...(ruleCallback && ruleCallback.length && { ruleCallback }),
        });
    }

    /**
     * create user specific acl object to check ability to perform any action
     */
    public forActor = (actor: Actor) => {
        let ctx: AuthenticatedRequestContext | undefined;
        const api = {
            withContext: (context: AuthenticatedRequestContext) => {
                ctx = context;
                return api;
            },
            canDoAction: async (action: Action, resource?: Resource) => {
                //find all rules for given user role
                const aclRules = this.aclRules.filter(
                    (rule) => rule.role === actor.role,
                );

                //for each rule, check action permission
                let allowed = false;
                for (const aclRule of aclRules) {
                    if (allowed) {
                        return allowed;
                    }

                    //check action permission
                    const hasActionPermission =
                        aclRule.actions.includes(action) ||
                        aclRule.actions.includes(Action.Manage);

                    //check for custom `ruleCallback` callback
                    if (!aclRule.ruleCallback) {
                        allowed = hasActionPermission;
                    } else {
                        if (!resource) {
                            throw new Error(
                                'Resource is required for ruleCallback',
                            );
                        }

                        allowed =
                            hasActionPermission &&
                            (
                                await Promise.all(
                                    aclRule.ruleCallback.map((callback) =>
                                        callback(resource, actor, ctx),
                                    ),
                                )
                            ).every((entry) => entry);
                    }
                }
                return allowed;
            },
        };
        return api;
    };
}
