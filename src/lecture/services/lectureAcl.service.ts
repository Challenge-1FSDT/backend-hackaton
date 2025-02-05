import { Injectable } from '@nestjs/common';

import { ClassStudentService } from '../../class-student/services/class-student.service';
import { ESchoolRole } from '../../schoolMember/constants/schoolRole.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { SchoolAuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { SubjectTeacherService } from '../../subject-teacher/services/subject-teacher.service';
import { Lecture } from '../entities/lecture.entity';

@Injectable()
export class LectureAclService extends BaseAclService<
    ESchoolRole,
    Lecture,
    SchoolAuthenticatedRequestContext
> {
    constructor(
        public readonly subjectTeacherService: SubjectTeacherService,
        private readonly classStudentService: ClassStudentService,
    ) {
        super();
        this.canDo(ESchoolRole.ADMIN, [Action.Manage]);
        this.canDo(ESchoolRole.FACULTY, [Action.Manage]);
        this.canDo(ESchoolRole.TEACHER, [Action.Create]);
        this.canDo(
            ESchoolRole.TEACHER,
            [Action.Read, Action.List, Action.Update],
            this.isLectureTeacher,
        );
        this.canDo(
            ESchoolRole.STUDENT,
            [Action.Read, Action.List] /*this.isLectureStudent*/,
        );
    }

    async isLectureTeacher(
        lecture: Lecture,
        user: Actor,
        ctx?: SchoolAuthenticatedRequestContext,
    ): Promise<boolean> {
        if (!ctx) {
            return false;
        }
        const teacher = await this.subjectTeacherService.getOne(
            ctx,
            ctx.schoolId,
            {
                subject: {
                    id: lecture.subject.id,
                },
                schoolMember: {
                    id: user.id,
                },
            },
            {},
        );

        return !!teacher;
    }

    async isLectureStudent(
        lecture: Lecture,
        user: Actor,
        ctx?: SchoolAuthenticatedRequestContext,
    ): Promise<boolean> {
        if (!ctx) {
            return false;
        }
        const student = await this.classStudentService.getOne(
            ctx,
            ctx.schoolId,
            {
                schoolMember: {
                    id: user.id,
                },
                class: {
                    lectures: {
                        id: lecture.id,
                    },
                },
            },
            {},
        );

        return !!student;
    }
}
