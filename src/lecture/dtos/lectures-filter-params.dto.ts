import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class LecturesFilterParams {
    @ApiProperty({
        type: String,
    })
    @IsDate()
    @Type(() => Date)
    startAt: Date;

    @ApiProperty({
        type: String,
    })
    @IsDate()
    @Type(() => Date)
    endAt: Date;
}
