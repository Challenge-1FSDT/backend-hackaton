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
    role: ESchoolRole;

    @ApiPropertyOptional()
    @Expose()
    registration?: string;
}
