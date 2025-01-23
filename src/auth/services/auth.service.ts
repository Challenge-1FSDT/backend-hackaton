import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { UserService } from '../../user/services/user.service';
import { ERole } from '../constants/role.constant';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import {
    AuthTokenOutput,
    UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(AuthService.name);
    }

    async validateUser(
        ctx: RequestContext,
        email: string,
        pass: string,
    ): Promise<UserAccessTokenClaims> {
        this.logger.log(ctx, `${this.validateUser.name} was called`);

        // The userService will throw Unauthorized in case of invalid username/password.
        const user = await this.userService.validateEmailPassword(
            ctx,
            email,
            pass,
        );

        // Prevent disabled users from logging in.
        if (user.isDisabled) {
            throw new UnauthorizedException(
                'This user account has been disabled',
            );
        }

        return user;
    }

    login(ctx: RequestContext): AuthTokenOutput {
        this.logger.log(ctx, `${this.login.name} was called`);

        return this.getAuthToken(ctx, ctx.user!);
    }

    async register(
        ctx: RequestContext,
        input: RegisterInput,
    ): Promise<RegisterOutput> {
        this.logger.log(ctx, `${this.register.name} was called`);

        const registeredUser = await this.userService.createUser(ctx, {
            ...input,
            role: ERole.USER,
        });
        return plainToClass(RegisterOutput, registeredUser, {
            excludeExtraneousValues: true,
        });
    }

    async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
        this.logger.log(ctx, `${this.refreshToken.name} was called`);

        const user = await this.userService.findById(ctx, ctx.user!.id);
        if (!user) {
            throw new UnauthorizedException('Invalid user id');
        }

        return this.getAuthToken(ctx, user);
    }

    getAuthToken(
        ctx: RequestContext,
        user: UserAccessTokenClaims | UserOutput,
    ): AuthTokenOutput {
        this.logger.log(ctx, `${this.getAuthToken.name} was called`);

        const subject = { sub: user.id };
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };

        const authToken = {
            refreshToken: this.jwtService.sign(subject, {
                expiresIn: this.configService.get(
                    'jwt.refreshTokenExpiresInSec',
                ),
            }),
            accessToken: this.jwtService.sign(
                { ...payload, ...subject },
                {
                    expiresIn: this.configService.get(
                        'jwt.accessTokenExpiresInSec',
                    ),
                },
            ),
        };
        return plainToClass(AuthTokenOutput, authToken, {
            excludeExtraneousValues: true,
        });
    }
}
