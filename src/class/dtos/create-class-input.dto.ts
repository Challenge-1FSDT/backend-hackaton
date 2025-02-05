import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClassInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    startAt: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    endAt: Date;
}
