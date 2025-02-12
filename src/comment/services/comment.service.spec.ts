import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ERole } from '../../auth/constants/role.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { CommentOutput } from '../dtos/comment-output.dto';
import {
    CreateCommentInput,
    UpdateArticleInput,
} from '../dtos/create-comment-input.dto';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentService } from './comment.service';
import { CommentAclService } from './comment-acl.service';

describe('ArticleService', () => {
    let service: CommentService;
    let mockedRepository: any;
    let mockedUserService: any;
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: CommentRepository,
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        findAndCount: jest.fn(),
                        getById: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        getUserById: jest.fn(),
                    },
                },
                {
                    provide: CommentAclService,
                    useValue: new CommentAclService(),
                },
                { provide: AppLogger, useValue: mockedLogger },
            ],
        }).compile();

        service = moduleRef.get<CommentService>(CommentService);
        mockedRepository = moduleRef.get(CommentRepository);
        mockedUserService = moduleRef.get(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const ctx = new RequestContext();

    describe('Create Article', () => {
        it('should get user from user claims user id', () => {
            ctx.user = {
                id: 1,
                roles: [ERole.USER],
                username: 'testuser',
            };

            service.create(ctx, new CreateCommentInput());
            expect(mockedUserService.getUserById).toHaveBeenCalledWith(ctx, 1);
        });

        it('should call repository save with proper article input and return proper output', async () => {
            ctx.user = {
                id: 1,
                roles: [ERole.USER],
                username: 'testuser',
            };

            const articleInput: CreateCommentInput = {
                title: 'Test',
                post: 'Hello, world!',
            };

            const author = new User();
            mockedUserService.getUserById.mockResolvedValue(author);
            const expected = {
                title: 'Test',
                post: 'Hello, world!',
                author,
            };

            const expectedOutput = {
                id: 1,
                title: 'Test',
                post: 'Hello, world!',
                author: new User(),
            };
            mockedRepository.save.mockResolvedValue(expectedOutput);

            const output = await service.create(ctx, articleInput);
            expect(mockedRepository.save).toHaveBeenCalledWith(expected);
            expect(output).toEqual(expectedOutput);
        });
    });

    describe('getArticles', () => {
        const limit = 10;
        const offset = 0;
        const currentDate = new Date();

        it('should return articles when found', async () => {
            const expectedOutput: CommentOutput[] = [
                {
                    id: 1,
                    title: 'Test',
                    post: 'Hello, world!',
                    author: new User(),
                    createdAt: currentDate,
                    updatedAt: currentDate,
                },
            ];

            mockedRepository.findAndCount.mockResolvedValue([
                expectedOutput,
                expectedOutput.length,
            ]);

            expect(await service.getPaged(ctx, limit, offset)).toEqual({
                articles: expectedOutput,
                count: expectedOutput.length,
            });
        });

        it('should return empty array when articles are not found', async () => {
            const expectedOutput: CommentOutput[] = [];

            mockedRepository.findAndCount.mockResolvedValue([
                expectedOutput,
                expectedOutput.length,
            ]);

            expect(await service.getPaged(ctx, limit, offset)).toEqual({
                articles: expectedOutput,
                count: expectedOutput.length,
            });
        });
    });

    describe('getArticle', () => {
        it('should return article by id when article is found', async () => {
            const id = 1;
            const currentDate = new Date();

            const expectedOutput: CommentOutput = {
                id: 1,
                title: 'Test',
                post: 'Hello, world!',
                author: new User(),
                createdAt: currentDate,
                updatedAt: currentDate,
            };

            mockedRepository.getById.mockResolvedValue(expectedOutput);

            expect(await service.getOne(ctx, id)).toEqual(expectedOutput);
        });

        it('should fail when article is not found and return the repository error', async () => {
            const id = 1;

            mockedRepository.getById.mockRejectedValue({
                message: 'error',
            });

            try {
                await service.getOne(ctx, id);
            } catch (error: any) {
                expect(error.message).toEqual('error');
            }
        });
    });

    describe('Update Article', () => {
        it('should get article by id', () => {
            ctx.user = {
                id: 1,
                roles: [ERole.USER],
                username: 'testuser',
            };
            const articleId = 1;
            const input: UpdateArticleInput = {
                title: 'New Title',
                post: 'New Post',
            };

            const author = new User();
            author.id = 1;
            mockedRepository.getById.mockResolvedValue({
                id: 1,
                title: 'Old title',
                post: 'Old post',
                author,
            });

            service.update(ctx, articleId, input);
            expect(mockedRepository.getById).toHaveBeenCalledWith(articleId);
        });

        it('should save article with updated title and post', async () => {
            ctx.user = {
                id: 1,
                roles: [ERole.USER],
                username: 'testuser',
            };
            const articleId = 1;
            const input: UpdateArticleInput = {
                title: 'New Title',
                post: 'New Post',
            };
            const author = new User();
            author.id = 1;

            mockedRepository.getById.mockResolvedValue({
                id: 1,
                title: 'Old title',
                post: 'Old post',
                author,
            });

            const expected = {
                id: 1,
                title: 'New Title',
                post: 'New Post',
                author,
            };
            await service.update(ctx, articleId, input);
            expect(mockedRepository.save).toHaveBeenCalledWith(expected);
        });

        it('should throw unauthorized exception when someone other than resource owner tries to update article', async () => {
            ctx.user = {
                id: 2,
                roles: [ERole.USER],
                username: 'testuser',
            };
            const articleId = 1;
            const input: UpdateArticleInput = {
                title: 'New Title',
                post: 'New Post',
            };
            const author = new User();
            author.id = 1;

            mockedRepository.getById.mockResolvedValue({
                id: 1,
                title: 'Old title',
                post: 'Old post',
                author,
            });

            try {
                await service.update(ctx, articleId, input);
            } catch (error: any) {
                expect(error.constructor).toEqual(UnauthorizedException);
                expect(mockedRepository.save).not.toHaveBeenCalled();
            }
        });
    });

    describe('deleteArticle', () => {
        const articleId = 1;

        it('should call repository.remove with correct parameter', async () => {
            ctx.user = {
                id: 1,
                roles: [ERole.USER],
                username: 'testuser',
            };

            const author = new User();
            author.id = 1;
            const foundArticle = new Comment();
            foundArticle.id = articleId;
            foundArticle.author = author;

            mockedRepository.getById.mockResolvedValue(foundArticle);

            await service.softDelete(ctx, articleId);
            expect(mockedRepository.remove).toHaveBeenCalledWith(foundArticle);
        });

        it('should throw not found exception if article not found', async () => {
            mockedRepository.getById.mockRejectedValue(new NotFoundException());
            try {
                await service.softDelete(ctx, articleId);
            } catch (error: any) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('should throw unauthorized exception when someone other than resource owner tries to delete article', async () => {
            ctx.user = {
                id: 2,
                roles: [ERole.USER],
                username: 'testuser',
            };
            const articleId = 1;

            const author = new User();
            author.id = 1;

            mockedRepository.getById.mockResolvedValue({
                id: 1,
                title: 'Old title',
                post: 'Old post',
                author,
            });

            try {
                await service.softDelete(ctx, articleId);
            } catch (error: any) {
                expect(error.constructor).toEqual(UnauthorizedException);
                expect(mockedRepository.save).not.toHaveBeenCalled();
            }
        });
    });
});
