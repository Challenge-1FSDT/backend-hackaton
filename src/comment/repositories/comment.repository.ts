import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }

    async getById(id: number): Promise<Comment> {
        const article = await this.findOne({ where: { id } });
        if (!article) {
            throw new NotFoundException();
        }

        return article;
    }
}
