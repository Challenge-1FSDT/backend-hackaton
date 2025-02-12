import { Injectable } from '@nestjs/common';

import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentAclService extends BaseAclService<
    ESchoolRole,
    Comment,
    SchoolAuthenticatedRequestContext
> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [
            Action.Create,
            Action.List,
            Action.Read,
        ]);
        this.canDo(
            ESchoolRole.TEACHER,
            [Action.Update, Action.Delete],
            this.isArticleAuthor,
        );
        this.canDo(ESchoolRole.STUDENT, [
            Action.Create,
            Action.List,
            Action.Read,
        ]);
        this.canDo(
            ESchoolRole.STUDENT,
            [Action.Update, Action.Delete],
            this.isArticleAuthor,
        );
    }

    isArticleAuthor(
        article: Comment,
        user: Actor,
        ctx?: SchoolAuthenticatedRequestContext,
    ): boolean {
        return article.author.id === user.id;
    }
}
