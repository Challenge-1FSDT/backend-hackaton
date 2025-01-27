import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolMemberModule } from '../schoolMember/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { SchoolController } from './controllers/school.controller';
import { School } from './entities/school.entity';
import { SchoolRepository } from './repositories/school.repository';
import { SchoolService } from './services/school.service';
import { SchoolAclService } from './services/school-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([School]),
        SchoolMemberModule,
    ],
    providers: [SchoolService, SchoolAclService, SchoolRepository],
    controllers: [SchoolController],
    exports: [SchoolService, SchoolAclService],
})
export class SchoolModule {}
