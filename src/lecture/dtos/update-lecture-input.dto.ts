import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateLectureInput {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startAt?: Date;

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endAt?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    classroom?: number;
}
