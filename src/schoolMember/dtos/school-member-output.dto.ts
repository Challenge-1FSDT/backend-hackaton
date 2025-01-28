import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ESchoolRole } from '../constants/schoolRole.constant';

export class SchoolMemberOutput {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    role: ESchoolRole;

    @ApiPropertyOptional()
    @Expose()
    registration?: string;
}
