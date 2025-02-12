import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SchoolIdGuard } from 'src/school/guards/school-id.guard';
import { AppLogger } from 'src/shared/logger/logger.service';

import { SchoolMemberOutput } from '../../school-member/dtos/school-member-output.dto';
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateClassStudentInput } from '../dtos/create-class-student-input.dto';
import { ClassStudentService } from '../services/class-student.service';

@ApiTags('classes', 'class students')
@Controller('classes/:classId/students')
export class ClassStudentController {
    constructor(
        private readonly classStudentService: ClassStudentService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassStudentController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({ summary: 'Get students' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([SchoolMemberOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async getAll(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classId', ParseIntPipe) classId: number,
        @Query() pagination: PaginationParamsDto,
    ): Promise<BaseApiResponse<SchoolMemberOutput[]>> {
        this.logger.log(ctx, `${this.getAll.name} was called`);

        const { data, count } = await this.classStudentService.getPaged(
            ctx,
            {
                class: {
                    id: classId,
                },
            },
            pagination,
            {
                schoolMember: true,
            },
        );

        const output = plainToInstance(
            SchoolMemberOutput,
            data.map((entry) => entry.schoolMember),
            {
                excludeExtraneousValues: false,
            },
        );

        return { data: output, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':userId')
    @ApiOperation({ summary: 'Get a student by the userId' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(SchoolMemberOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async getByUserId(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classId', ParseIntPipe) classId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.getByUserId.name} was called`);

        const data = await this.classStudentService.getOne(
            ctx,
            ctx.schoolId,
            {
                class: {
                    id: classId,
                },
                schoolMember: {
                    user: {
                        id: userId,
                    },
                },
            },
            { schoolMember: true },
        );

        const output = plainToInstance(SchoolMemberOutput, data.schoolMember, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({ summary: 'Create a student' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(SchoolMemberOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async postStudent(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classId', ParseIntPipe) classId: number,
        @Body() body: CreateClassStudentInput,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.postStudent.name} was called`);

        const data = await this.classStudentService.createStudent(
            ctx,
            classId,
            body,
        );

        const output = plainToInstance(SchoolMemberOutput, data.schoolMember, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':userId')
    @ApiOperation({ summary: 'Deletes a student' })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async deleteStudent(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classId', ParseIntPipe) classId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteStudent.name} was called`);

        await this.classStudentService.deleteByUserId(ctx, classId, userId);
    }
}
