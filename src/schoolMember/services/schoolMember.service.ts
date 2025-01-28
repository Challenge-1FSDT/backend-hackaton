import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ERole } from '../../auth/constants/role.constant';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { ESchoolRole } from '../constants/schoolRole.constant';
import { CreateSchoolMemberInput } from '../dtos/school-member-input.dto';
import { SchoolMember } from '../entities/schoolMember.entity';
import { SchoolMemberRepository } from '../repositories/schoolMember.repository';
import { isOfHigherOrEqualRole } from '../utils';
import { SchoolMemberAclService } from './schoolMember-acl.service';

@Injectable()
export class SchoolMemberService {
    public constructor(
        private readonly repository: SchoolMemberRepository,
        private readonly userService: UserService,
        private readonly aclService: SchoolMemberAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolMemberService.name);
    }

    public async getSchoolMember(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        userId: number,
    ): Promise<SchoolMember | null> {
        this.logger.log(ctx, `${this.getSchoolMember.name} was called`);

        const member = await this.repository.findOne({
            where: { user: { id: userId }, school: { id: schoolId } },
            relations: ['user', 'school'],
        });
        if (!member) {
            throw new NotFoundException();
        }

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .canDoAction(Action.Read, member));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return member;
    }

    public async createSchoolMember(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        create: CreateSchoolMemberInput,
    ): Promise<SchoolMember> {
        this.logger.log(ctx, `${this.createSchoolMember.name} was called`);

        const schoolMember = plainToInstance(SchoolMember, create, {
            excludeExtraneousValues: true,
        });

        const actor: Actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            ((await this.aclService
                .forActor(actor)
                .canDoAction(Action.Create)) &&
                isOfHigherOrEqualRole(
                    ctx.user.schoolMember!.role,
                    create.role ?? ESchoolRole.STUDENT,
                ));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        if (
            isOfHigherOrEqualRole(
                ctx.user.schoolMember!.role,
                schoolMember.role,
            )
        ) {
            throw new ForbiddenException();
        }

        const user =
            (await this.userService.findByEmail(ctx, create.email)) ||
            (await this.userService.createUser(ctx, {
                ...create,
                role: ERole.USER,
            }));
        schoolMember.user = user;
        const savedMember = await this.repository.save(schoolMember);

        return savedMember;
    }
}
