import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Subject } from './entities/subject.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Subject])],
  providers: [],
  controllers: [],
  exports: [],
})
export class SubjectModule {}
