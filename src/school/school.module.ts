import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { SchoolController } from './controllers/school.controller';
import { School } from './entities/school.entity';
import { SchoolMember } from './entities/schoolMember.entity';
import { SchoolRepository } from './repositories/school.repository';
import { SchoolService } from './services/school.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([School, SchoolMember])],
    providers: [SchoolService, JwtAuthStrategy, SchoolRepository],
    controllers: [SchoolController],
    exports: [],
})
export class SchoolModule {}
