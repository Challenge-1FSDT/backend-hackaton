import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { ClassroomModule } from './classroom/classroom.module';
import { LectureModule } from './lecture/lecture.module';
import { SchoolModule } from './school/school.module';
import { SharedModule } from './shared/shared.module';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    ArticleModule,
    AttendanceModule,
    ClassModule,
    ClassroomModule,
    LectureModule,
    SchoolModule,
    SubjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
