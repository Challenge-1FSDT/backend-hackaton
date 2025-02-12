import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Point } from 'typeorm';

export class ClassroomOutput {
    @ApiProperty()
    @Expose()
    name: string;

    @ApiPropertyOptional()
    @Expose()
    description?: string;

    @ApiPropertyOptional()
    @Expose()
    location?: Point; // number[]

    @ApiPropertyOptional()
    @Expose()
    locationRadius?: number;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
