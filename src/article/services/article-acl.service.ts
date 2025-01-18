import { Injectable } from '@nestjs/common';

import { ERole } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { Article } from '../entities/article.entity';

@Injectable()
export class ArticleAclService extends BaseAclService<Article> {
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

  isArticleAuthor(article: Article, user: Actor): boolean {
    return article.author.id === user.id;
  }
}
