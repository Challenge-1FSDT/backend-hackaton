import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AttendanceOutput {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    startAt?: Date;

    @Expose()
    @ApiProperty()
    endAt?: Date;

    @Expose()
    @ApiProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;

    @Expose()
    @ApiProperty()
    deletedAt?: Date;
}
