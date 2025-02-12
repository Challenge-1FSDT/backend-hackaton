import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SchoolMemberClaims } from '../../school-member/dtos/school-member-claims.dto';
import { ERole } from '../constants/role.constant';

export class AuthTokenOutput {
    @Expose()
    @ApiProperty()
    accessToken: string;

    @Expose()
    @ApiProperty()
    refreshToken: string;
}

export class UserAccessTokenClaims {
    @Expose()
    id: number;
    @Expose()
    email: string;
    @Expose()
    role: ERole;
    @Expose()
    schoolMember?: SchoolMemberClaims;
}

export class UserRefreshTokenClaims {
    id: number;
}
