import { UserAccessTokenClaims } from '../../auth/dtos/auth-token-output.dto';

export interface RequestContext {
    requestID: string | undefined;

    url: string;

    ip: string | undefined;

    schoolId: number | null;

    user: UserAccessTokenClaims | null;
}

export interface AuthenticatedRequestContext extends RequestContext {
    user: UserAccessTokenClaims;
}

export interface SchoolAuthenticatedRequestContext
    extends AuthenticatedRequestContext {
    schoolId: number;
}
