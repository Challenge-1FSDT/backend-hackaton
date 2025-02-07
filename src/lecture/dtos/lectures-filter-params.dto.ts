import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class LecturesFilterParams {
    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startAt: Date;

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endAt: Date;
}
