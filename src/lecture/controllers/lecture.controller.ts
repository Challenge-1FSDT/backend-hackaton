import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
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
import { AuthenticatedRequestContext } from 'src/shared/request-context/request-context.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { SchoolIdGuard } from '../../school/guards/school-id.guard';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { LectureOutput } from '../dtos/lecture-output.dto';
import { LecturesFilterParams } from '../dtos/lectures-filter-params.dto';
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
    async getClassrooms(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
        @Body() body: LecturesFilterParams,
    ): Promise<BaseApiResponse<LectureOutput[]>> {
        this.logger.log(ctx, `${this.getClassrooms.name} was called`);

        const { lectures, count } = await this.lectureService.getLectures(
            ctx,
            {
                startAt: Between(
                    MoreThanOrEqual<Date>(body.startAt.toJSDate()),
                    LessThanOrEqual<Date>(body.endAt.toJSDate()),
                ),
                endAt: Between(
                    MoreThanOrEqual<Date>(body.startAt.toJSDate()),
                    LessThanOrEqual<Date>(body.endAt.toJSDate()),
                ),
            },
            { limit: query.limit, offset: query.offset },
        );

        const lectureOutput = plainToInstance(LectureOutput, lectures, {
            excludeExtraneousValues: true,
        });

        return { data: lectureOutput, meta: { count } };
    }
}
