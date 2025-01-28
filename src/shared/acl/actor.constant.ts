import { AuthenticatedRequestContext } from '../request-context/request-context.dto';

/**
 * The actor who is perfoming the action
 */
export interface Actor {
    id: number;

    role: string;

    ctx?: AuthenticatedRequestContext;
}
