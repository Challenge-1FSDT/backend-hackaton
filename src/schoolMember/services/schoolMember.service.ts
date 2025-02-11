import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { ERole } from '../../auth/constants/role.constant';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import {
    PaginatedResult,
    PaginationParamsDto,
} from '../../shared/dtos/pagination-params.dto';
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

    public async getPaged(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        where: FindOptionsWhere<SchoolMember>,
        pagination: PaginationParamsDto,
        relations: FindOptionsRelations<SchoolMember>,
    ): Promise<PaginatedResult<SchoolMember>> {
        this.logger.log(ctx, `${this.getPaged.name} was called`);

        const actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService
                .forActor(actor)
                .withContext(ctx)
                .canDoAction(Action.List));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const [data, count] = await this.repository.findAndCount({
            where: {
                ...where,
                school: {
                    id: schoolId,
                },
            },
            take: pagination.limit,
            skip: pagination.offset,
            relations,
        });

        return { data, count };
    }

    public async getOne(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        userId: number,
    ): Promise<SchoolMember> {
        this.logger.log(ctx, `${this.getOne.name} was called`);

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

    public async create(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        create: CreateSchoolMemberInput,
    ): Promise<SchoolMember> {
        this.logger.log(ctx, `${this.create.name} was called`);

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

        const user =
            (await this.userService.findByEmail(ctx, create.email)) ||
            (await this.userService.createUser(ctx, {
                ...create,
                role: ERole.USER,
            }));

        const savedMember = await this.repository.save({
            ...create,
            school: { id: schoolId },
            user: { id: user.id },
        });

        return savedMember;
    }

    public async delete(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        userId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.delete.name} was called`);

        const actor = ctx.user.schoolMember!;
        const isAllowed =
            ctx.user.role === ERole.ADMIN ||
            (await this.aclService.forActor(actor).canDoAction(Action.Delete));
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.delete({
            school: { id: schoolId },
            user: { id: userId },
        });
    }
}
