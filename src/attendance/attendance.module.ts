import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Attendance])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AttendanceModule {}
