import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateClassInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    startAt: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    endAt: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { each: true },
    )
    students?: number[];
}
