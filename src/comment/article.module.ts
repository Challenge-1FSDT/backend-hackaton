import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../schoolMember/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './controllers/comment.controller';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';
import { CommentAclService } from './services/comment-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([Comment]),
        UserModule,
        SchoolMemberModule,
    ],
    providers: [CommentService, CommentAclService, CommentRepository],
    controllers: [CommentController],
    exports: [CommentService],
})
export class ArticleModule {}
