import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../school-member/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { ClassController } from './controllers/class.controller';
import { Class } from './entities/class.entity';
import { ClassRepository } from './repositories/class.repository';
import { ClassService } from './services/class.service';
import { ClassAclService } from './services/class-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([Class]),
        SchoolMemberModule,
    ],
    providers: [ClassService, ClassAclService, ClassRepository],
    controllers: [ClassController],
    exports: [ClassService],
})
export class ClassModule {}
