import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolMemberModule } from '../school-member/schoolMember.module';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([User]),
        forwardRef(() => SchoolMemberModule),
    ],
    providers: [UserService, UserAclService, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserRepository, UserAclService],
})
export class UserModule {}
