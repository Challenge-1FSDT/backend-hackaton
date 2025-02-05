import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubjectTeacherInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
