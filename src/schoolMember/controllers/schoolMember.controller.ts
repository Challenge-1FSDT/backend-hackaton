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
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { ESchoolRole } from '../constants/schoolRole.constant';
import { SchoolRoles } from '../decorators/schoolRole.decorator';
import { CreateSchoolMemberInput } from '../dtos/school-member-input.dto';
import { SchoolMemberOutput } from '../dtos/school-member-output.dto';
import { SchoolRolesGuard } from '../guards/schoolRoles.guard';
import { SchoolMemberService } from '../services/schoolMember.service';

@ApiTags('schools', 'school members')
@Controller('schools/:schoolId/members')
export class SchoolMemberController {
    constructor(
        private readonly schoolMemberService: SchoolMemberService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolMemberController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Create a school member',
    })
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
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY)
    @ApiBearerAuth()
    async createSchoolMember(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('schoolId', ParseIntPipe) schoolId: number,
        @Body() body: CreateSchoolMemberInput,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.createSchoolMember.name} was called`);

        const schoolMember = await this.schoolMemberService.create(
            ctx,
            schoolId,
            body,
        );

        const schoolOutput = plainToInstance(SchoolMemberOutput, schoolMember, {
            excludeExtraneousValues: true,
        });

        return { data: schoolOutput, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all members for a school',
    })
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
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY, ESchoolRole.TEACHER)
    @ApiBearerAuth()
    async getSchoolMembers(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('schoolId', ParseIntPipe) schoolId: number,
        @Query() pagination: PaginationParamsDto,
    ) {
        this.logger.log(ctx, `${this.getSchoolMembers.name} was called`);

        const { data, count } = await this.schoolMemberService.getPaged(
            ctx,
            schoolId,
            {},
            pagination,
            { user: true },
        );

        const output = plainToInstance(SchoolMemberOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':userId')
    @ApiOperation({
        summary: 'Get a school member by id',
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
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(
        ESchoolRole.ADMIN,
        ESchoolRole.FACULTY,
        ESchoolRole.TEACHER,
        ESchoolRole.STUDENT,
    )
    @ApiBearerAuth()
    public async getById(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('schoolId', ParseIntPipe) schoolId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.getById.name} was called`);

        const data = await this.schoolMemberService.getOne(
            ctx,
            schoolId,
            userId,
        );

        const output = plainToInstance(SchoolMemberOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':userId')
    @ApiOperation({
        summary: 'Delete a school member by id',
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
    @UseGuards(JwtAuthGuard, SchoolRolesGuard)
    @SchoolRoles(ESchoolRole.ADMIN, ESchoolRole.FACULTY)
    @ApiBearerAuth()
    public async delete(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('schoolId', ParseIntPipe) schoolId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.delete.name} was called`);

        const data = await this.schoolMemberService.delete(
            ctx,
            schoolId,
            userId,
        );

        const output = plainToInstance(SchoolMemberOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }
}
