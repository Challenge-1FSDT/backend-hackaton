import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../school-member/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { SubjectController } from './controllers/subject.controller';
import { Subject } from './entities/subject.entity';
import { SubjectRepository } from './repositories/subject.repository';
import { SubjectService } from './services/subject.service';
import { SubjectAclService } from './services/subject-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([Subject]),
        SchoolMemberModule,
    ],
    providers: [SubjectService, SubjectAclService, SubjectRepository],
    controllers: [SubjectController],
    exports: [SubjectService],
})
export class SubjectModule {}
