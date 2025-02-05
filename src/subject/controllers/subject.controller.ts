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
import { SchoolRoles } from 'src/schoolMember/decorators/schoolRole.decorator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SchoolIdGuard } from '../../school/guards/school-id.guard';
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
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
import { CreateSubjectInput } from '../dtos/create-subject-input.dto';
import { SubjectOutput } from '../dtos/subject-output.dto';
import { UpdateSubjectInput } from '../dtos/update-subject-input.dto';
import { SubjectService } from '../services/subject.service';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectController {
    constructor(
        private readonly service: SubjectService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SubjectController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all subjects',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([SubjectOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async getPaged(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<SubjectOutput[]>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const { data, count } = await this.service.getPaged(
            ctx,
            ctx.schoolId,
            {},
            { limit: query.limit, offset: query.offset },
        );

        const output = plainToInstance(SubjectOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':subjectId')
    @ApiOperation({
        summary: 'Get a subject',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(SubjectOutput),
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
        @Param('subjectId', ParseIntPipe) subject: number,
    ): Promise<BaseApiResponse<SubjectOutput>> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const data = await this.service.getById(ctx, ctx.schoolId, subject);

        const output = plainToInstance(SubjectOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Create a subject',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(SubjectOutput),
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
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    public async postSubject(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Body() body: CreateSubjectInput,
    ): Promise<BaseApiResponse<SubjectOutput>> {
        this.logger.log(ctx, `${this.postSubject.name} was called`);

        const data = await this.service.create(ctx, ctx.schoolId, body);

        const output = plainToInstance(SubjectOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put(':subjectId')
    @ApiOperation({
        summary: 'Update a subject',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(SubjectOutput),
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
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    public async putSubject(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('subjectId', ParseIntPipe) subjectId: number,
        @Body() body: UpdateSubjectInput,
    ): Promise<BaseApiResponse<SubjectOutput>> {
        this.logger.log(ctx, `${this.putSubject.name} was called`);

        const data = await this.service.update(
            ctx,
            ctx.schoolId,
            subjectId,
            body,
        );

        const output = plainToInstance(SubjectOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':subjectId')
    @ApiOperation({
        summary: 'Delete a subject',
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
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    public async deleteSubject(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('subjectId', ParseIntPipe) subjectId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteSubject.name} was called`);

        await this.service.delete(ctx, ctx.schoolId, subjectId);
    }
}
