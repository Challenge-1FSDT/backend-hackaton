import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
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

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
    BaseApiErrorResponse,
    BaseApiResponse,
    SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import {
    CreateCommentInput,
    UpdateArticleInput,
} from '../dtos/article-input.dto';
import { CommentOutput } from '../dtos/comment-output.dto';
import { CommentService } from '../services/comment.service';

@ApiTags('comments')
@Controller('comments')
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
    @UseGuards(JwtAuthGuard)
    async createArticle(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Body() input: CreateCommentInput,
    ): Promise<BaseApiResponse<CommentOutput>> {
        const article = await this.commentService.createArticle(ctx, input);
        return { data: article, meta: {} };
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
    @UseGuards(JwtAuthGuard)
    async getComments(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Query() query: PaginationParamsDto,
    ): Promise<BaseApiResponse<CommentOutput[]>> {
        this.logger.log(ctx, `${this.getComments.name} was called`);

        const { articles, count } = await this.commentService.getArticles(
            ctx,
            query.limit,
            query.offset,
        );

        return { data: articles, meta: { count } };
    }

    @Get(':id')
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getArticle(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Param('id') id: number,
    ): Promise<BaseApiResponse<CommentOutput>> {
        this.logger.log(ctx, `${this.getArticle.name} was called`);

        const article = await this.commentService.getArticleById(ctx, id);
        return { data: article, meta: {} };
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update article API',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(CommentOutput),
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateArticle(
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Param('id') articleId: number,
        @Body() input: UpdateArticleInput,
    ): Promise<BaseApiResponse<CommentOutput>> {
        const article = await this.commentService.updateArticle(
            ctx,
            articleId,
            input,
        );
        return { data: article, meta: {} };
    }

    @Delete(':id')
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
        @ReqContext() ctx: AuthenticatedRequestContext,
        @Param('id') id: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.deleteArticle.name} was called`);

        return this.commentService.deleteArticle(ctx, id);
    }
}
