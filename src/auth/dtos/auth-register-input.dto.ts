import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
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
    @IsString()
    @Length(6, 100)
    password: string;
}
