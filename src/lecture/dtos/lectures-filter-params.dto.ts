import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';
import { DateTime } from 'luxon';

export class LecturesFilterParams {
    @ApiProperty({
        type: String,
    })
    @IsDateString()
    @Transform(({ value }) => DateTime.fromISO(value), {
        toClassOnly: true,
    })
    @Transform(({ value }) => value.toISO(), {
        toClassOnly: true,
    })
    startAt: DateTime;

    @ApiProperty({
        type: String,
    })
    @IsDateString()
    @Transform(({ value }) => DateTime.fromISO(value), {
        toClassOnly: true,
    })
    @Transform(({ value }) => value.toISO(), {
        toClassOnly: true,
    })
    endAt: DateTime;
}
