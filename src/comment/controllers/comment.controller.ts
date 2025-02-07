import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
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
import { CommentOutput } from '../dtos/comment-output.dto';
import { CreateCommentInput } from '../dtos/create-comment-input.dto';
import { UpdateCommentInput } from '../dtos/update-comment-input.dto';
import { CommentService } from '../services/comment.service';

@ApiTags('lectures', 'lecture comments')
@Controller('lectures/:lectureId/comments')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(CommentController.name);
    }

    @Post()
    @ApiOperation({
        summary: 'Create a comment',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(CommentOutput),
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    async createArticle(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId') lectureId: number,
        @Body() input: CreateCommentInput,
    ): Promise<BaseApiResponse<CommentOutput>> {
        const article = await this.commentService.create(
            ctx,
            ctx.schoolId,
            lectureId,
            input,
        );

        const output = plainToInstance(CommentOutput, article, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @Get()
    @ApiOperation({
        summary: 'Get comments as a list',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([CommentOutput]),
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    async getComments(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId') lectureId: number,
        @Query() pagination: PaginationParamsDto,
    ): Promise<BaseApiResponse<CommentOutput[]>> {
        this.logger.log(ctx, `${this.getComments.name} was called`);

        const { data, count } = await this.commentService.getPaged(
            ctx,
            ctx.schoolId,
            { lecture: { id: lectureId } },
            pagination,
            { author: true },
        );

        const output = plainToInstance(CommentOutput, data, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: { count } };
    }

    @Get(':commentId')
    @ApiOperation({
        summary: 'Get article by id API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(CommentOutput),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    @ApiBearerAuth()
    async getArticle(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId') lectureId: number,
        @Param('commentId') id: number,
    ): Promise<BaseApiResponse<CommentOutput>> {
        this.logger.log(ctx, `${this.getArticle.name} was called`);

        const article = await this.commentService.getOne(
            ctx,
            ctx.schoolId,
            {
                id,
                lecture: { id: lectureId },
            },
            {
                author: true,
            },
        );

        const output = plainToInstance(CommentOutput, article, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @Put(':commentId')
    @ApiOperation({
        summary: 'Update article API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(CommentOutput),
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SchoolIdGuard)
    async updateArticle(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId') lectureId: number,
        @Param('commentId') commentId: number,
        @Body() input: UpdateCommentInput,
    ): Promise<BaseApiResponse<CommentOutput>> {
        const article = await this.commentService.update(
            ctx,
            ctx.schoolId,
            {
                id: commentId,
                lecture: { id: lectureId },
            },
            input,
        );

        const output = plainToInstance(CommentOutput, article, {
            excludeExtraneousValues: true,
        });

        return { data: output, meta: {} };
    }

    @Delete(':commentId')
    @ApiOperation({
        summary: 'Delete article by id API',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteArticle(
        @ReqContext() ctx: SchoolAuthenticatedRequestContext,
        @Param('lectureId') lectureId: number,
        @Param('commentId') id: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteArticle.name} was called`);

        return this.commentService.delete(ctx, ctx.schoolId, {
            id,
            lecture: { id: lectureId },
        });
    }
}
