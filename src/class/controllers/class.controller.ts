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
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { ClassOutput } from '../dtos/class-output.dto';
import { CreateClassInput } from '../dtos/create-class-input.dto';
import { ClassService } from '../services/class.service';

@ApiTags('classes')
@Controller('classes')
export class ClassController {
    constructor(
        private readonly classService: ClassService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all classes',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([ClassOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async getClasses(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<ClassOutput[]>> {
        this.logger.log(ctx, `${this.getClasses.name} was called`);

        const { data, count } = await this.classService.getPaged(
            ctx,
            ctx.schoolId,
            {},
            { limit: query.limit, offset: query.offset },
        );

        const output = plainToInstance(ClassOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':classId')
    @ApiOperation({
        summary: 'Get a class',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(ClassOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async getClass(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classId', ParseIntPipe) classId: number,
    ): Promise<BaseApiResponse<ClassOutput>> {
        this.logger.log(ctx, `${this.getClass.name} was called`);

        const data = await this.classService.getById(
            ctx,
            ctx.schoolId,
            classId,
        );

        const output = plainToInstance(ClassOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Create a class',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(ClassOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async postClass(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Body() body: CreateClassInput,
    ): Promise<BaseApiResponse<ClassOutput>> {
        this.logger.log(ctx, `${this.postClass.name} was called`);

        const data = await this.classService.createClass(
            ctx,
            ctx.schoolId,
            body,
        );

        const output = plainToInstance(ClassOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':classId')
    @ApiOperation({
        summary: 'Create a class',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(ClassOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async deleteClass(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('classId', ParseIntPipe) classId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteClass.name} was called`);

        await this.classService.deleteClass(ctx, ctx.schoolId, classId);
    }
}
