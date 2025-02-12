import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { ClassroomController } from './controllers/classroom.controller';
import { Classroom } from './entities/classroom.entity';
import { ClassroomRepository } from './repositories/classroom.repository';
import { ClassroomService } from './services/classroom.service';
import { ClassroomAclService } from './services/classroom-acl.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([Classroom])],
    providers: [ClassroomService, ClassroomAclService, ClassroomRepository],
    controllers: [ClassroomController],
    exports: [ClassroomService],
})
export class ClassroomModule {}
