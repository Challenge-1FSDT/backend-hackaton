import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
} from 'class-validator';
import { DateTime } from 'luxon';

import { IsCPF } from '../../shared/validators/isCPF';
import { ESchoolRole } from '../constants/schoolRole.constant';

export class CreateSchoolMemberInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    firstName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    lastName?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(200)
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsPhoneNumber('BR')
    @MaxLength(200)
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsCPF()
    @MaxLength(11)
    taxId?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    @Transform(({ value }) => DateTime.fromISO(value), {
        toClassOnly: true,
    })
    @Transform(({ value }) => value.toISO(), {
        toPlainOnly: true,
    })
    dateOfBirth: DateTime;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    registration?: string;

    @ApiPropertyOptional({
        enum: ESchoolRole,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(ESchoolRole)
    role?: ESchoolRole;
}
