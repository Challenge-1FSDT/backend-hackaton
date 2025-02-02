import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClassStudentInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
