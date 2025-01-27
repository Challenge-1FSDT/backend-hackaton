import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { Lecture } from '../entities/lecture.entity';
import { AppLogger } from '../../shared/logger/logger.service';
import { LectureRepository } from '../repositories/lecture.repository';
import { Actor } from 'src/shared/acl/actor.constant';
import { LectureAclService } from './lectureAcl.service';
import { Action } from '../../shared/acl/action.constant';

@Injectable()
export class LectureService {
    constructor(
        private readonly repository: LectureRepository,
        private readonly aclService: LectureAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(LectureService.name);
    }

    public async getLecture(
        ctx: AuthenticatedRequestContext,
        lectureId: number,
    ): Promise<Lecture> {
        this.logger.log(ctx, `${this.getLecture.name} was called`);

        const lecture = await this.repository.findOne({
            where: { id: lectureId },
            relations: ['subject'],
        });
        if (!lecture) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        let isAllowed = await this.aclService
            .forActor(actor)
            .canDoAction(Action.Read, lecture);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return lecture;
    }
}
