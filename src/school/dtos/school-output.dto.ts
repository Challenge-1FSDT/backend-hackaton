import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Point } from 'typeorm';

export class SchoolOutput {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty()
    fantasyName?: string;

    @Expose()
    @ApiProperty()
    taxId: string;

    @Expose()
    @ApiProperty()
    address: string;

    @Expose()
    @ApiProperty()
    city: string;

    @Expose()
    @ApiProperty()
    state: string;

    @Expose()
    @ApiProperty()
    @Transform(({ value }) => (value as Point).coordinates, {
        toClassOnly: true,
    })
    location: number[];

    @Expose()
    @ApiProperty()
    locationRadius: number;

    @Expose()
    @ApiProperty()
    createdAt: string;

    @Expose()
    @ApiProperty()
    updatedAt: string;

    @Expose()
    @ApiProperty()
    deletedAt?: string;
}
