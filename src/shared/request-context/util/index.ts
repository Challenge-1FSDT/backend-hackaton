import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import { UserAccessTokenClaims } from '../../../auth/dtos/auth-token-output.dto';
import {
    FORWARDED_FOR_TOKEN_HEADER,
    REQUEST_ID_TOKEN_HEADER,
} from '../../constants';
import { isValidNumber } from '../../typeguards';
import {
    AuthenticatedRequestContext,
    RequestContext,
} from '../request-context.dto';

// Creates a RequestContext object from Request
export function createRequestContext(
    request: Request,
): RequestContext | AuthenticatedRequestContext {
    const ctx = {} as RequestContext | AuthenticatedRequestContext;
    ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER);
    ctx.url = request.url;
    ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER)
        ? request.header(FORWARDED_FOR_TOKEN_HEADER)
        : request.ip;
    
    if (request.user) {
        (ctx as AuthenticatedRequestContext).user = plainToClass(
            UserAccessTokenClaims,
            request.user,
            {
                excludeExtraneousValues: true,
            },
        );
    }

    const schoolId = Number(request.params.schoolId || request.query.schoolId);
    ctx.schoolId = isValidNumber(schoolId) ? schoolId : null;

    return ctx;
}
