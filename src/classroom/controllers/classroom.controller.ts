import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SchoolService } from '../../school/services/school.service';
import { AppLogger } from '../../shared/logger/logger.service';

@ApiTags('classrooms')
@Controller('classrooms')
export class ClassroomController {
    constructor(
        private readonly schoolService: SchoolService,
        /*private readonly classroomService: ClassroomService,*/
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(ClassroomController.name);
    }

    /*@UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOperation({
        summary: 'Get all classrooms',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([ClasssroomOutput]),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    async getClassrooms(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<ClassroomOutput[]>> {
        this.logger.log(ctx, `${this.getClassrooms.name} was called`);

        const { classrooms, count } = await this.classroomService.getClassrooms(
            ctx,
            schoolId,
            query.limit,
            query.offset,
        );

        return { data: classrooms, meta: { count } };
    }*/
}
