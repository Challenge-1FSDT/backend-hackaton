import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SchoolMemberClaims } from '../../schoolMember/dtos/school-member-claims.dto';
import { SchoolMemberService } from '../../schoolMember/services/schoolMember.service';
import { createRequestContext } from '../../shared/request-context/util';
import { STRATEGY_JWT_AUTH } from '../constants/strategy.constant';
import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';
import { UserService } from '../../user/services/user.service';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export class User extends UserAccessTokenClaims {}
    }
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
    Strategy,
    STRATEGY_JWT_AUTH,
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly schoolMemberService: SchoolMemberService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwt.publicKey')!,
            algorithms: ['RS256'],
            passReqToCallback: true,
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async validate(req: Request, payload: any): Promise<UserAccessTokenClaims> {
        const context = createRequestContext(req);
        let schoolMemberClaims: SchoolMemberClaims | null = null;
        if (context.schoolId) {
            const schoolMember = await this.schoolMemberService.getSchoolMember(
                context,
                context.schoolId,
                payload.sub,
            );
            schoolMemberClaims = plainToInstance(
                SchoolMemberClaims,
                schoolMember,
                {
                    excludeExtraneousValues: true,
                },
            );
        }

        const user = await this.userService.getUserById(context, payload.sub);

        // Passport automatically creates a user object, based on the value we return from the validate() method,
        // and assigns it to the Request object as req.user
        return {
            id: payload.sub,
            email: payload.email,
            role: user.role,
            ...(schoolMemberClaims && {
                schoolMember: schoolMemberClaims,
            }),
        };
    }
}
