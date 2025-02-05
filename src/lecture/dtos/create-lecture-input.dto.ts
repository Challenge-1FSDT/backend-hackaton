import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateLectureInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startAt: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endAt: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    subject: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    class: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    classroom?: number;
}
