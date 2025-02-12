import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../school-member/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { ClassStudentController } from './controllers/class-student.controller';
import { ClassStudent } from './entities/class-student.entity';
import { ClassStudentRepository } from './repositories/class-student.repository';
import { ClassStudentService } from './services/class-student.service';
import { ClassStudentAclService } from './services/class-student-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([ClassStudent]),
        SchoolMemberModule,
    ],
    providers: [
        ClassStudentService,
        ClassStudentAclService,
        ClassStudentRepository,
    ],
    controllers: [ClassStudentController],
    exports: [ClassStudentService],
})
export class ClassStudentModule {}
