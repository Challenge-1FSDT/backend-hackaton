import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../schoolMember/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { AttendanceController } from './controllers/attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { LectureModule } from '../lecture/lecture.module';
import { AttendanceService } from './services/attendance.service';
import { AttendanceRepository } from './repositories/attendance.repository';
import { AttendanceAclService } from './services/attendanceAcl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([Attendance]),
        SchoolMemberModule,
        LectureModule,
    ],
    providers: [AttendanceService, AttendanceAclService, AttendanceRepository],
    controllers: [AttendanceController],
    exports: [AttendanceService, AttendanceAclService],
})
export class AttendanceModule {}
