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
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SchoolIdGuard } from '../../school/guards/school-id.guard';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { ClassroomOutput } from '../dtos/classroom-output.dto';
import { CreateClassroomInput } from '../dtos/create-classroom-input.dto';
import { UpdateClassroomInput } from '../dtos/update-classroom-input.dto';
import { ClassroomService } from '../services/classroom.service';

@ApiTags('classrooms')
@Controller('classrooms')
export class ClassroomController {
    constructor(
        private readonly service: ClassroomService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassroomController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all classrooms',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([ClassroomOutput]),
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
    async getClassrooms(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<ClassroomOutput[]>> {
        this.logger.log(ctx, `${this.getClassrooms.name} was called`);

        const { data, count } = await this.service.getPaged(
            ctx,
            ctx.schoolId,
            {},
            { limit: query.limit, offset: query.offset },
            {},
        );

        const output = plainToInstance(ClassroomOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':classroomId')
    @ApiOperation({
        summary: 'Get a classroom by id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(ClassroomOutput),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
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
    async getClassroom(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classroomId', ParseIntPipe) classroomId: number,
    ): Promise<BaseApiResponse<ClassroomOutput>> {
        this.logger.log(ctx, `${this.getClassroom.name} was called`);

        const classroom = await this.service.getOne(
            ctx,
            ctx.schoolId,
            { id: classroomId },
            {},
        );

        const output = plainToInstance(ClassroomOutput, classroom, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Create a classroom',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(ClassroomOutput),
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
    async createClassroom(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Body() create: CreateClassroomInput,
    ): Promise<BaseApiResponse<ClassroomOutput>> {
        this.logger.log(ctx, `${this.createClassroom.name} was called`);

        const classroom = await this.service.create(ctx, ctx.schoolId, create);

        const output = plainToInstance(ClassroomOutput, classroom, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put(':classroomId')
    @ApiOperation({
        summary: 'Update a classroom by id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(ClassroomOutput),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
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
    async updateClassroom(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @Body() update: UpdateClassroomInput,
    ): Promise<BaseApiResponse<ClassroomOutput>> {
        this.logger.log(ctx, `${this.updateClassroom.name} was called`);

        const classroom = await this.service.update(
            ctx,
            ctx.schoolId,
            classroomId,
            update,
        );

        const output = plainToInstance(ClassroomOutput, classroom, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':classroomId')
    @ApiOperation({
        summary: 'Delete a classroom by id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
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
    async deleteClassroom(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classroomId', ParseIntPipe) classroomId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteClassroom.name} was called`);

        await this.service.delete(ctx, ctx.schoolId, classroomId);
    }
}
