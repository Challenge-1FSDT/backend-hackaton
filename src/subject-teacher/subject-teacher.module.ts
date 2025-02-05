import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../schoolMember/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { SubjectTeacherController } from './controllers/subject-teacher.controller';
import { SubjectTeacher } from './entities/subject-teacher.entity';
import { SubjectTeacherRepository } from './repositories/subject-teacher.repository';
import { SubjectTeacherService } from './services/subject-teacher.service';
import { SubjectTeacherAclService } from './services/subject-teacher-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([SubjectTeacher]),
        SchoolMemberModule,
    ],
    providers: [
        SubjectTeacherService,
        SubjectTeacherAclService,
        SubjectTeacherRepository,
    ],
    controllers: [SubjectTeacherController],
    exports: [SubjectTeacherService],
})
export class SubjectTeacherModule {}
