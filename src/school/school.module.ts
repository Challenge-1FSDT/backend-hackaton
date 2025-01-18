import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { School } from './entities/school.entity';
import { SchoolMember } from './entities/schoolMember.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([School, SchoolMember])],
  providers: [],
  controllers: [],
  exports: [],
})
export class SchoolModule {}
