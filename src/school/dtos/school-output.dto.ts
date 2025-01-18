import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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
    location: string;

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
