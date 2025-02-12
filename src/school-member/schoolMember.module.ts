import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { SchoolMemberController } from './controllers/schoolMember.controller';
import { SchoolMember } from './entities/schoolMember.entity';
import { SchoolMemberRepository } from './repositories/schoolMember.repository';
import { SchoolMemberService } from './services/schoolMember.service';
import { SchoolMemberAclService } from './services/schoolMember-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([SchoolMember]),
        forwardRef(() => UserModule),
    ],
    providers: [
        SchoolMemberService,
        SchoolMemberAclService,
        SchoolMemberRepository,
    ],
    controllers: [SchoolMemberController],
    exports: [SchoolMemberService, SchoolMemberAclService],
})
export class SchoolMemberModule {}
