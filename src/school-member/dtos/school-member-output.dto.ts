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
        {
            toPlainOnly: true,
        },
    )
    id: number;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.firstName ?? value,
        {
            toPlainOnly: true,
        },
    )
    firstName: string;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.lastName ?? value,
        {
            toPlainOnly: true,
        },
    )
    lastName?: string;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.email ?? value,
        {
            toPlainOnly: true,
        },
    )
    email: string;

    @ApiProperty()
    @Expose()
    @Transform(
        ({ obj, value }: { obj: SchoolMember | undefined; value: number }) =>
            obj?.user?.phone ?? value,
        {
            toPlainOnly: true,
        },
    )
    phone?: string;

    @ApiProperty()
    @Expose()
    role: ESchoolRole;

    @ApiPropertyOptional()
    @Expose()
    registration?: string;
}
