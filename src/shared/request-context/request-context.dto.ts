import { UserAccessTokenClaims } from '../../auth/dtos/auth-token-output.dto';

export class RequestContext {
    public requestID: string | undefined;

    public url: string;

    public ip: string | undefined;

    // TODO : Discuss with team if this import is acceptable or if we should move UserAccessTokenClaims to shared.
    public user: UserAccessTokenClaims | null;

    public schoolId: number | null;
}

export class AuthenticatedRequestContext extends RequestContext {
    declare public user: UserAccessTokenClaims;
}
