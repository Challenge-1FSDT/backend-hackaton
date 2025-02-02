import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './controllers/comment.controller';
import { Article } from './entities/article.entity';
import { ArticleRepository } from './repositories/article.repository';
import { CommentService } from './services/comment.service';
import { ArticleAclService } from './services/article-acl.service';
import { SchoolMemberModule } from '../schoolMember/schoolMember.module';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([Article]),
        UserModule,
        SchoolMemberModule,
    ],
    providers: [CommentService, ArticleAclService, ArticleRepository],
    controllers: [CommentController],
    exports: [CommentService],
})
export class ArticleModule {}
