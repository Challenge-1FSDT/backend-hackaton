import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
    Length,
    MaxLength,
} from 'class-validator';

import { IsCPF } from '../../shared/validators/isCPF';

export class RegisterInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    firstName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
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

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
    })
    @Length(6, 100)
    password: string;
}
