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

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SchoolIdGuard } from '../../school/guards/school-id.guard';
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { SchoolRoles } from '../../schoolMember/decorators/schoolRole.decorator';
import { SchoolMemberOutput } from '../../schoolMember/dtos/school-member-output.dto';
import { SchoolRolesGuard } from '../../schoolMember/guards/schoolRoles.guard';
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateSubjectTeacherInput } from '../dtos/create-subject-teacher-input.dto';
import { SubjectTeacherService } from '../services/subject-teacher.service';

@ApiTags('subjects', 'subject teachers')
@Controller('subjects/:subjectId/teachers')
export class SubjectTeacherController {
    constructor(
        private readonly service: SubjectTeacherService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SubjectTeacherController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all teachers for a subject',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([SchoolMemberOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async getPaged(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('subjectId', ParseIntPipe) subjectId: number,
        @Query() pagination: PaginationParamsDto,
    ): Promise<BaseApiResponse<SchoolMemberOutput[]>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const { data, count } = await this.service.getPaged(
            ctx,
            ctx.schoolId,
            {
                subject: {
                    id: subjectId,
                },
            },
            pagination,
            {
                schoolMember: true,
            },
        );

        const output = plainToInstance(SchoolMemberOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':userId')
    @ApiOperation({
        summary: 'Get a teacher for a subject',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(SchoolMemberOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async getById(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('subjectId', ParseIntPipe) subjectId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const data = await this.service.getOne(
            ctx,
            ctx.schoolId,
            {
                subject: {
                    id: subjectId,
                },
                schoolMember: {
                    user: {
                        id: userId,
                    },
                },
            },
            {
                schoolMember: true,
            },
        );

        const output = plainToInstance(SchoolMemberOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Add a teacher to a subject',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(SchoolMemberOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY)
    @ApiBearerAuth()
    public async postSubjectTeacher(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('subjectId', ParseIntPipe) subjectId: number,
        @Body() body: CreateSubjectTeacherInput,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.postSubjectTeacher.name} was called`);

        const data = await this.service.create(
            ctx,
            ctx.schoolId,
            subjectId,
            body,
        );

        const output = plainToInstance(SchoolMemberOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':userId')
    @ApiOperation({
        summary: 'Remove a teacher from a subject',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        type: BaseApiResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY)
    @ApiBearerAuth()
    public async deleteSubjectTeacher(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('subjectId', ParseIntPipe) subjectId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteSubjectTeacher.name} was called`);

        await this.service.delete(ctx, ctx.schoolId, subjectId, userId);
    }
}
