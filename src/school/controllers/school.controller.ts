import {
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
        summary: 'Get users as a list API',
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
    async getUsers(
        @ReqContext() ctx: RequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<SchoolOutput[]>> {
        this.logger.log(ctx, `${this.getUsers.name} was called`);

        const { schools, count } = await this.schoolService.getSchools(
            ctx,
            query.limit,
            query.offset,
        );

        return { data: schools, meta: { count } };
    }
}
