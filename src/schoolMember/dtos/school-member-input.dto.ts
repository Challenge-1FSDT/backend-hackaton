import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
} from 'class-validator';

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
    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date;

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
