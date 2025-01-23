import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Class } from './entities/class.entity';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([Class])],
    providers: [],
    controllers: [],
    exports: [],
})
export class ClassModule {}
