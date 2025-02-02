import { Expose, Transform } from 'class-transformer';

import { ESchoolRole } from '../constants/schoolRole.constant';

export class SchoolMemberClaims {
    @Expose()
    id: number;
    @Expose()
    @Transform(({ value, obj }) => value ?? obj.school.id)
    schoolId: number;
    @Expose()
    @Transform(({ value, obj }) => value ?? obj.user.id)
    userId: number;
    @Expose()
    role: ESchoolRole;
}
