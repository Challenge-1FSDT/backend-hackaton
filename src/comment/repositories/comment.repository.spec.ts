import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from './comment.repository';

describe('ArticleRepository', () => {
    let repository: CommentRepository;

    let dataSource: {
        createEntityManager: jest.Mock;
    };

    beforeEach(async () => {
        dataSource = {
            createEntityManager: jest.fn(),
        };

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CommentRepository,
                {
                    provide: DataSource,
                    useValue: dataSource,
                },
            ],
        }).compile();

        repository = moduleRef.get<CommentRepository>(CommentRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('Get article by id', () => {
        it('should call findOne with correct id', () => {
            const id = 1;

            jest.spyOn(repository, 'findOne').mockResolvedValue(new Comment());
            repository.getById(id);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
        });

        it('should return article if found', async () => {
            const expectedOutput: any = {
                id: 1,
                title: 'Default Article',
                post: 'Hello, world!',
                author: new User(),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(expectedOutput);

            expect(await repository.getById(1)).toEqual(expectedOutput);
        });

        it('should throw NotFoundError when article not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            try {
                await repository.getById(1);
            } catch (error: any) {
                expect(error.constructor).toBe(NotFoundException);
            }
        });
    });
});
