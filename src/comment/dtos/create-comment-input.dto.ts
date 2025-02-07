import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    post: string;
}
