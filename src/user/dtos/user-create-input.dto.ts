import {
    ApiHideProperty,
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
    Length,
    MaxLength,
} from 'class-validator';

import { ERole } from '../../auth/constants/role.constant';
import { IsCPF } from '../../shared/validators/isCPF';

export class CreateUserInput {
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

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date;

    @ApiHideProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
    })
    @Length(8, 100)
    password?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(ERole)
    role: ERole;
}
