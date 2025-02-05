import {
    ClassSerializerInterceptor,
    Controller,
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
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { SchoolRoles } from '../../schoolMember/decorators/schoolRole.decorator';
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
import { AttendanceOutput } from '../dtos/attendance-output.dto';
import { AttendanceService } from '../services/attendance.service';

@ApiTags('lectures', 'lecture attendances')
@Controller('lectures/:lectureId/attendances')
export class AttendanceController {
    constructor(
        private readonly attendanceService: AttendanceService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(AttendanceController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get a list of attendances for a lecture',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([AttendanceOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    public async getAttendanceList(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId', ParseIntPipe) lectureId: number,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<AttendanceOutput[]>> {
        this.logger.log(ctx, `${this.getAttendanceList.name} was called`);

        const { attendances, count } =
            await this.attendanceService.getAttendanceList(
                ctx,
                ctx.schoolId,
                lectureId,
                query.limit,
                query.offset,
            );

        const attendanceOutput = plainToInstance(
            AttendanceOutput,
            attendances,
            {
                excludeExtraneousValues: true,
            },
        );

        return { data: attendanceOutput, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':studentId')
    @ApiOperation({
        summary: "Get a student's attendance for a lecture",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([AttendanceOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(
        ESchoolRole.ADMIN,
        ESchoolRole.FACULTY,
        ESchoolRole.TEACHER,
        ESchoolRole.STUDENT,
    )
    @ApiBearerAuth()
    public async getAttendance(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId', ParseIntPipe) lectureId: number,
        @Param('studentId', ParseIntPipe) studentId: number,
    ): Promise<BaseApiResponse<AttendanceOutput>> {
        this.logger.log(ctx, `${this.getAttendance.name} was called`);

        const attendance = await this.attendanceService.getAttendance(
            ctx,
            ctx.schoolId,
            lectureId,
            studentId,
        );

        const attendanceOutput = plainToInstance(AttendanceOutput, attendance, {
            excludeExtraneousValues: true,
        });

        return { data: attendanceOutput, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: "Creates or updates an student's own attendance",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([AttendanceOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.STUDENT)
    @ApiBearerAuth()
    public async postAttendance(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId', ParseIntPipe) lectureId: number,
    ): Promise<BaseApiResponse<AttendanceOutput>> {
        this.logger.log(ctx, `${this.getAttendanceList.name} was called`);

        const attendance =
            await this.attendanceService.createOrUpdateAttendance(
                ctx,
                ctx.schoolId,
                lectureId,
                ctx.user.id,
            );

        const attendanceOutput = plainToInstance(AttendanceOutput, attendance, {
            excludeExtraneousValues: true,
        });

        return { data: attendanceOutput, meta: {} };
    }
}
