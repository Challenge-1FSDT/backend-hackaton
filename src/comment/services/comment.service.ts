import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { CreateCommentInput } from '../dtos/create-comment-input.dto';
import { UpdateCommentInput } from '../dtos/update-comment-input.dto';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentAclService } from './comment-acl.service';

@Injectable()
export class CommentService {
    constructor(
        private repository: CommentRepository,
        private aclService: CommentAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(CommentService.name);
    }

    async create(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        lectureId: number,
        input: CreateCommentInput,
    ): Promise<Comment> {
        this.logger.log(ctx, `${this.create.name} was called`);

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = this.aclService
            .forActor(actor)
            .canDoAction(Action.Create);
        if (!isAllowed) {
            throw new UnauthorizedException();
        }

        this.logger.log(ctx, `calling ${CommentRepository.name}.save`);
        const comment = await this.repository.save({
            ...input,
            author: ctx.user.schoolMember,
            school: { id: schoolId },
            lecture: { id: lectureId },
        });

        return comment;
    }

    async getPaged(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Comment>,
        pagination: PaginationParamsDto,
        relations: FindOptionsRelations<Comment>,
    ): Promise<PaginatedResult<Comment>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const actor: Actor = ctx.user!;

        const isAllowed = this.aclService
            .forActor(actor)
            .canDoAction(Action.List);
        if (!isAllowed) {
            throw new UnauthorizedException();
        }

        this.logger.log(ctx, `calling ${CommentRepository.name}.findAndCount`);
        const [data, count] = await this.repository.findAndCount({
            where: {
                ...where,
                school: { id: schoolId },
            },
            take: pagination.limit,
            skip: pagination.offset,
            relations,
        });

        return { data, count };
    }

    async getOne(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Comment>,
        relations: FindOptionsRelations<Comment>,
    ): Promise<Comment> {
        this.logger.log(ctx, `${this.getOne.name} was called`);

        const article = await this.repository.findOne({
            where: {
                ...where,
                school: { id: schoolId },
            },
            relations,
        });
        if (!article) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.Read, article);
        if (!isAllowed) {
            throw new UnauthorizedException();
        }

        return article;
    }

    async update(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Comment>,
        input: UpdateCommentInput,
    ): Promise<Comment> {
        this.logger.log(ctx, `${this.update.name} was called`);

        const article = await this.repository.findOne({
            where: {
                ...where,
                school: { id: schoolId },
            },
        });
        if (!article) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = this.aclService
            .forActor(actor)
            .canDoAction(Action.Update, article);
        if (!isAllowed) {
            throw new UnauthorizedException();
        }

        const updatedArticle: Comment = {
            ...article,
            ...input,
        };

        this.logger.log(ctx, `calling ${CommentRepository.name}.save`);
        const updated = await this.repository.save(updatedArticle);

        return updated;
    }

    async delete(
        ctx: SchoolAuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<Comment>,
    ): Promise<void> {
        this.logger.log(ctx, `${this.delete.name} was called`);

        const comment = await this.repository.findOne({
            where: {
                ...where,
                school: { id: schoolId },
            },
        });
        if (!comment) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed = this.aclService
            .forActor(actor)
            .canDoAction(Action.Delete, comment);
        if (!isAllowed) {
            throw new UnauthorizedException();
        }

        this.logger.log(ctx, `calling ${CommentRepository.name}.remove`);
        await this.repository.softRemove(comment);
    }
}
