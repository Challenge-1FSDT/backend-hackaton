import { Injectable } from '@nestjs/common';

import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { Lecture } from '../entities/lecture.entity';

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
        this.canDo(ESchoolRole.STUDENT, [Action.Read], this.isLectureStudent);
    }

    async isLectureTeacher(lecture: Lecture, user: Actor): Promise<boolean> {
        /*return (await lecture.subject.teachers).some(
            // FIXME: replace by service call
            (teacher) => teacher.id === user.id,
        );*/
        return true;
    }

    async isLectureStudent(lecture: Lecture, user: Actor): Promise<boolean> {
        /*return (await lecture.class.students).some(
            // FIXME: replace by service call
            (student) => student.id === user.id,
        );*/
        return true;
    }
}
