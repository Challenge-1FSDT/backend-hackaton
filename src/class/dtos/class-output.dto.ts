import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClassOutput {
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
