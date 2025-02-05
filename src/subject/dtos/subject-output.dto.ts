import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubjectOutput {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty({ required: false })
    @Expose()
    description?: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
