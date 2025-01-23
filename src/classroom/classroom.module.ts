import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Classroom } from './entities/classroom.entity';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([Classroom])],
    providers: [],
    controllers: [],
    exports: [],
})
export class ClassroomModule {}
