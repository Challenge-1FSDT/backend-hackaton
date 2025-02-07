import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommentInput {
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    post: string;
}
