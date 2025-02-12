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
    Put,
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
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { SchoolAuthenticatedRequestContext } from 'src/shared/request-context/request-context.dto';
import { Between } from 'typeorm';

import { SchoolIdGuard } from '../../school/guards/school-id.guard';
import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { SchoolRoles } from '../../school-member/decorators/schoolRole.decorator';
import { SchoolRolesGuard } from '../../school-member/guards/schoolRoles.guard';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { CreateLectureInput } from '../dtos/create-lecture-input.dto';
import { LectureOutput } from '../dtos/lecture-output.dto';
import { LecturesFilterParams } from '../dtos/lectures-filter-params.dto';
import { UpdateLectureInput } from '../dtos/update-lecture-input.dto';
import { LectureService } from '../services/lecture.service';

@ApiTags('lectures')
@Controller('lectures')
export class LectureController {
    constructor(
        private readonly lectureService: LectureService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(LectureController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all lectures',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([LectureOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async getPaged(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Query() query: PaginationParamsDto & LecturesFilterParams,
    ): Promise<BaseApiResponse<LectureOutput[]>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const { lectures, count } = await this.lectureService.getLectures(
            ctx,
            ctx.schoolId,
            {
                startAt: Between(query.startAt, query.endAt),
                endAt: Between(query.startAt, query.endAt),
            },
            { limit: query.limit, offset: query.offset },
        );

        const lectureOutput = plainToInstance(LectureOutput, lectures, {
            excludeExtraneousValues: true,
        });

        return { data: lectureOutput, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':lectureId')
    @ApiOperation({
        summary: 'Get a lecture',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(LectureOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async getById(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId', ParseIntPipe) lectureId: number,
    ): Promise<BaseApiResponse<LectureOutput>> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const data = await this.lectureService.getLecture(
            ctx,
            ctx.schoolId,
            lectureId,
        );

        const output = plainToInstance(LectureOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Create a lecture',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(LectureOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    public async postLecture(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Body() input: CreateLectureInput,
    ): Promise<BaseApiResponse<LectureOutput>> {
        this.logger.log(ctx, `${this.postLecture.name} was called`);

        const data = await this.lectureService.createLecture(
            ctx,
            ctx.schoolId,
            input,
        );

        const output = plainToInstance(LectureOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put(':lectureId')
    @ApiOperation({
        summary: 'Update a lecture',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(LectureOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    public async putLecture(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId', ParseIntPipe) lectureId: number,
        @Body() input: UpdateLectureInput,
    ): Promise<BaseApiResponse<LectureOutput>> {
        this.logger.log(ctx, `${this.putLecture.name} was called`);

        const data = await this.lectureService.updateLecture(
            ctx,
            ctx.schoolId,
            lectureId,
            input,
        );

        const output = plainToInstance(LectureOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':lectureId')
    @ApiOperation({
        summary: 'Delete a lecture',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    public async deleteLecture(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId', ParseIntPipe) lectureId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteLecture.name} was called`);

        await this.lectureService.deleteLecture(ctx, ctx.schoolId, lectureId);
    }
}
