import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';
import { SchoolMemberModule } from '../schoolMember/schoolMember.module';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([User]),
        SchoolMemberModule,
    ],
    providers: [UserService, UserAclService, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserAclService],
})
export class UserModule {}
