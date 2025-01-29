import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { LectureController } from './controllers/lecture.controller';
import { Lecture } from './entities/lecture.entity';
import { LectureRepository } from './repositories/lecture.repository';
import { LectureService } from './services/lecture.service';
import { LectureAclService } from './services/lectureAcl.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([Lecture])],
    providers: [LectureService, LectureAclService, LectureRepository],
    controllers: [LectureController],
    exports: [LectureService, LectureAclService],
})
export class LectureModule {}
