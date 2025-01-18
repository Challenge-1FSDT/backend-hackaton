import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Lecture } from './entities/lecture.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Lecture])],
  providers: [],
  controllers: [],
  exports: [],
})
export class LectureModule {}
