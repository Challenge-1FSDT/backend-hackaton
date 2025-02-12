import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    ArrayMinSize,
    ArrayNotEmpty,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { Point } from 'typeorm';

import { IsCNPJ } from '../../shared/validators/isCNPJ';

export class UpdateSchoolInput {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    fantasyName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsCNPJ()
    @MaxLength(14)
    taxId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    address: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    city: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(2)
    state: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber(
        { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 6 },
        { each: true },
    )
    location: Point; // number[]

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(1000)
    locationRadius: number;
}
