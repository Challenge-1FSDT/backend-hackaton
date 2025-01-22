import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

export class CreateSchoolInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    fantasyName?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsCNPJ()
    @MaxLength(11)
    taxId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    city: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(2)
    state: string;

    @ApiProperty()
    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber(undefined, { each: true })
    @Transform((value) => ({
        type: 'Point',
        coordinates: value,
    }))
    location: Point; // number[]

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(1000)
    locationRadius: number;
}
