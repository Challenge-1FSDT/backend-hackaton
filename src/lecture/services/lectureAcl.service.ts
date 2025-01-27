import { Injectable } from '@nestjs/common';
import { BaseAclService } from '../../shared/acl/acl.service';
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { Lecture } from '../entities/lecture.entity';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';

@Injectable()
export class LectureAclService extends BaseAclService<ESchoolRole, Lecture> {
    constructor() {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(
            ESchoolRole.TEACHER,
            [Action.Read, Action.List],
            this.isLectureTeacher,
        );
    }

    async isLectureTeacher(lecture: Lecture, user: Actor): Promise<boolean> {
        return (await lecture.subject.teachers).some(
            (teacher) => teacher.id === user.id,
        );
    }
}
