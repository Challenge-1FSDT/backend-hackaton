import { AuthenticatedRequestContext, RequestContext, SchoolAuthenticatedRequestContext } from '../request-context/request-context.dto';
import { Action } from './action.constant';
import { Actor } from './actor.constant';

/**
 * Custom rule callback definition
 */
export type RuleCallback<
    Resource,
    CtxType extends
        | SchoolAuthenticatedRequestContext
        | AuthenticatedRequestContext
        | RequestContext = RequestContext,
> = (
    resource: Resource,
    actor: Actor,
    ctx?: CtxType,
) => Promise<boolean> | boolean;

/**
 * ACL rule format
 */
export type AclRule<
    RoleEnum,
    Resource,
    CtxType extends
        | SchoolAuthenticatedRequestContext
        | AuthenticatedRequestContext
        | RequestContext = RequestContext,
> = {
    //if rule for particular role or for all role
    role: RoleEnum;

    //list of actions permissible
    actions: Action[];

    //specific rule there or otherwise true
    ruleCallback?: RuleCallback<Resource, CtxType>[];
};
