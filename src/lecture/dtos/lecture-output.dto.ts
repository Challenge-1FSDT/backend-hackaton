import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LectureOutput {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    startAt: string;

    @ApiProperty()
    @Expose()
    endAt: string;
}
