import { Action } from './action.constant';
import { Actor } from './actor.constant';

/**
 * Custom rule callback definition
 */
export type RuleCallback<Resource> = (
    resource: Resource,
    actor: Actor,
) => Promise<boolean> | boolean;

/**
 * ACL rule format
 */
export type AclRule<RoleEnum, Resource> = {
    //if rule for particular role or for all role
    role: RoleEnum;

    //list of actions permissible
    actions: Action[];

    //specific rule there or otherwise true
    ruleCallback?: RuleCallback<Resource>;
};
