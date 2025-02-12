import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { AuthorOutput } from './author-output.dto';

export class CommentOutput {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    post: string;

    @Expose()
    @ApiProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;

    @Expose()
    @Type(() => AuthorOutput)
    @ApiProperty()
    author: AuthorOutput;
}
