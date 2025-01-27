import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Lecture } from './entities/lecture.entity';
import { LectureService } from './services/lecture.service';
import { LectureRepository } from './repositories/lecture.repository';
import { LectureAclService } from './services/lectureAcl.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([Lecture])],
    providers: [LectureService, LectureAclService, LectureRepository],
    controllers: [],
    exports: [LectureService, LectureAclService],
})
export class LectureModule {}
