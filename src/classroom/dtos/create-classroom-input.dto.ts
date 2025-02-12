import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateClassroomInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber(
        { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 6 },
        { each: true },
    )
    location?: Point; // number[]

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(1000)
    locationRadius?: number;
}
