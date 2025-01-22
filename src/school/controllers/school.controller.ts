import {
    Body,
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

import { ERole } from '../../auth/constants/role.constant';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { CreateSchoolInput } from '../dtos/create-school-input.dto';
import { SchoolOutput } from '../dtos/school-output.dto';
import { SchoolService } from '../services/school.service';

@ApiTags('schools')
@Controller('schools')
export class SchoolController {
    constructor(
        private readonly schoolService: SchoolService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolController.name);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get a list of schools',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([SchoolOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ERole.ADMIN)
    @ApiBearerAuth()
    async getSchools(
        @ReqContext() ctx: RequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<SchoolOutput[]>> {
        this.logger.log(ctx, `${this.getSchools.name} was called`);

        const { schools, count } = await this.schoolService.getSchools(
            ctx,
            query.limit,
            query.offset,
        );

        const schoolOutput = plainToInstance(SchoolOutput, schools, {
            excludeExtraneousValues: true,
        });

        return { data: schoolOutput, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    @ApiOperation({
        summary: 'Get a specific school',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(SchoolOutput),
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ERole.USER, ERole.ADMIN)
    @ApiBearerAuth()
    async getSchool(
        @ReqContext() ctx: RequestContext,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseApiResponse<SchoolOutput>> {
        this.logger.log(ctx, `${this.getSchool.name} was called`);

        const school = await this.schoolService.getSchool(ctx, id);
        const schoolOutput = plainToInstance(SchoolOutput, school, {
            excludeExtraneousValues: true,
        });

        return { data: schoolOutput, meta: {} };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @ApiOperation({
        summary: 'Create a school',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([UserOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ERole.ADMIN)
    @ApiBearerAuth()
    async createSchools(
        @ReqContext() ctx: RequestContext,
        @Body() body: CreateSchoolInput,
    ): Promise<BaseApiResponse<SchoolOutput>> {
        this.logger.log(ctx, `${this.getSchools.name} was called`);

        const school = await this.schoolService.createSchool(ctx, body);

        const schoolOutput = plainToInstance(SchoolOutput, school, {
            excludeExtraneousValues: true,
        });

        return { data: schoolOutput, meta: {} };
    }
}
