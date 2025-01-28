import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
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
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { ESchoolRole } from '../constants/schoolRole.constant';
import { SchoolRoles } from '../decorators/schoolRole.decorator';
import { CreateSchoolMemberInput } from '../dtos/school-member-input.dto';
import { SchoolMemberOutput } from '../dtos/school-member-output.dto';
import { SchoolRolesGuard } from '../guards/schoolRoles.guard';
import { SchoolMemberService } from '../services/schoolMember.service';

@ApiTags('school members')
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
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Param('schoolId', ParseIntPipe) schoolId: number,
        @Body() body: CreateSchoolMemberInput,
    ): Promise<BaseApiResponse<SchoolMemberOutput>> {
        this.logger.log(ctx, `${this.createSchoolMember.name} was called`);

        const schoolMember = await this.schoolMemberService.createSchoolMember(
            ctx,
            schoolId,
            body,
        );

        const schoolOutput = plainToInstance(SchoolMemberOutput, schoolMember, {
            excludeExtraneousValues: true,
        });

        return { data: schoolOutput, meta: {} };
    }
}
