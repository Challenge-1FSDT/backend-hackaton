import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
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
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { UpdateUserInput } from '../dtos/user-update-input.dto';
import { UpdateUserSelfInput } from '../dtos/user-update-self-input.dto';
import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(UserController.name);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me')
    @ApiOperation({
        summary: 'Get user me API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(UserOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    async getMyProfile(
        @ReqContext() ctx: AuthenticatedRequestContext,
    ): Promise<BaseApiResponse<UserOutput>> {
        this.logger.log(ctx, `${this.getMyProfile.name} was called`);

        const user = await this.userService.findById(ctx, ctx.user!.id);

        const userOutput = plainToInstance(UserOutput, user, {
            excludeExtraneousValues: true,
        });

        return { data: userOutput, meta: {} };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('me')
    @ApiOperation({
        summary: 'Update user me API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(UserOutput),
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        type: BaseApiErrorResponse,
    })
    async updateMyProfile(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Body() input: UpdateUserSelfInput,
    ): Promise<BaseApiResponse<UserOutput>> {
        this.logger.log(ctx, `${this.updateMyProfile.name} was called`);

        const user = await this.userService.updateUser(
            ctx,
            ctx.user!.id,
            input,
        );

        const userOutput = plainToInstance(UserOutput, user, {
            excludeExtraneousValues: true,
        });

        return { data: userOutput, meta: {} };
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
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<UserOutput[]>> {
        this.logger.log(ctx, `${this.getUsers.name} was called`);

        const { users, count } = await this.userService.getUsers(
            ctx,
            query.limit,
            query.offset,
        );

        const userOutput = plainToInstance(UserOutput, users, {
            excludeExtraneousValues: true,
        });

        return { data: userOutput, meta: { count } };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    @ApiOperation({
        summary: 'Get user by id API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(UserOutput),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ERole.ADMIN)
    async getUser(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Param('id') id: number,
    ): Promise<BaseApiResponse<UserOutput>> {
        this.logger.log(ctx, `${this.getUser.name} was called`);

        const user = await this.userService.getUserById(ctx, id);

        const userOutput = plainToInstance(UserOutput, user, {
            excludeExtraneousValues: true,
        });

        return { data: userOutput, meta: {} };
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update user API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(UserOutput),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ERole.ADMIN)
    async updateUser(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Param('id') userId: number,
        @Body() input: UpdateUserInput,
    ): Promise<BaseApiResponse<UserOutput>> {
        this.logger.log(ctx, `${this.updateUser.name} was called`);

        const user = await this.userService.updateUser(ctx, userId, input);

        const userOutput = plainToInstance(UserOutput, user, {
            excludeExtraneousValues: true,
        });

        return { data: userOutput, meta: {} };
    }
}
