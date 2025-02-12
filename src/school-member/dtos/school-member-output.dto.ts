import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { ESchoolRole } from '../constants/schoolRole.constant';
import { SchoolMember } from '../entities/schoolMember.entity';

export class SchoolMemberOutput {
    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.id ?? value,
    )
    id: number;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.firstName ?? value,
    )
    firstName: string;

    @ApiPropertyOptional()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.lastName ?? value,
    )
    lastName?: string;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.email ?? value,
    )
    email: string;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.phone ?? value,
    )
    phone?: string;

    @ApiProperty()
    @Expose()
    role: ESchoolRole;

    @ApiPropertyOptional()
    @Expose()
    registration?: string;
}
