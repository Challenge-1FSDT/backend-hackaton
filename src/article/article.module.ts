import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ArticleController } from './controllers/article.controller';
import { Article } from './entities/article.entity';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleService } from './services/article.service';
import { ArticleAclService } from './services/article-acl.service';
import { SchoolMemberModule } from '../schoolMember/schoolMember.module';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([Article]),
        UserModule,
        SchoolMemberModule,
    ],
    providers: [ArticleService, ArticleAclService, ArticleRepository],
    controllers: [ArticleController],
    exports: [ArticleService],
})
export class ArticleModule {}
