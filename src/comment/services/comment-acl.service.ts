import { Injectable } from '@nestjs/common';

import { ERole } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { Comments } from '../entities/comment.entity';

@Injectable()
export class ArticleAclService extends BaseAclService<ERole, Comments> {
    constructor() {
        super();
        this.canDo(ERole.ADMIN, [Action.Manage]);
        this.canDo(ERole.USER, [Action.Create, Action.List, Action.Read]);
        this.canDo(
            ERole.USER,
            [Action.Update, Action.Delete],
            this.isArticleAuthor,
        );
    }

    isArticleAuthor(article: Comments, user: Actor): boolean {
        return article.author.id === user.id;
    }
}
