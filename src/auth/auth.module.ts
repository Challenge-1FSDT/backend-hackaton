import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SchoolMemberModule } from '../school-member/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { STRATEGY_JWT_AUTH } from './constants/strategy.constant';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        SharedModule,
        PassportModule.register({
            defaultStrategy: STRATEGY_JWT_AUTH,
            property: 'user',
        }),
        JwtModule.registerAsync({
            imports: [SharedModule],
            useFactory: async (configService: ConfigService) => ({
                publicKey: configService.get<string>('jwt.publicKey'),
                privateKey: configService.get<string>('jwt.privateKey'),
                signOptions: {
                    algorithm: 'RS256',
                },
            }),
            inject: [ConfigService],
        }),
        UserModule,
        SchoolMemberModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtAuthStrategy,
        JwtRefreshStrategy,
    ],
    exports: [AuthService, JwtAuthStrategy],
})
export class AuthModule {}
