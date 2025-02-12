import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LectureModule } from '../lecture/lecture.module';
import { SchoolMemberModule } from '../school-member/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { AttendanceController } from './controllers/attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { AttendanceRepository } from './repositories/attendance.repository';
import { AttendanceService } from './services/attendance.service';
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
