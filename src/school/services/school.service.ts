import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ERole } from '../../auth/constants/role.constant';
import { ESchoolRole } from '../../school-member/constants/schoolRole.constant';
import { SchoolMemberService } from '../../school-member/services/schoolMember.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { AuthenticatedRequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { CreateSchoolInput } from '../dtos/create-school-input.dto';
import { UpdateSchoolInput } from '../dtos/update-school-input.dto';
import { School } from '../entities/school.entity';
import { SchoolRepository } from '../repositories/school.repository';
import { SchoolAclService } from './school-acl.service';

@Injectable()
export class SchoolService {
    public constructor(
        private readonly repository: SchoolRepository,
        private readonly userService: UserService,
        private readonly schoolMemberService: SchoolMemberService,
        private readonly aclService: SchoolAclService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(SchoolService.name);
    }

    async getSchools(
        ctx: AuthenticatedRequestContext,
        limit: number,
        offset: number,
    ): Promise<{ schools: School[]; count: number }> {
        this.logger.log(ctx, `${this.getSchools.name} was called`);

        const [schools, count] = await this.repository.findAndCount({
            ...(ctx.user?.role !== ERole.ADMIN && {
                where: {
                    members: {
                        user: {
                            id: ctx.user!.id,
                        },
                    },
                },
            }),
            take: limit,
            skip: offset,
        });

        return { schools, count };
    }

    async getSchool(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
    ): Promise<School> {
        this.logger.log(ctx, `${this.getSchool.name} was called`);

        const school = await this.repository.getById(schoolId);

        const actor: Actor = ctx.user!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .withContext(ctx)
            .canDoAction(Action.Read, school);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return school;
    }

    async create(
        ctx: AuthenticatedRequestContext,
        create: CreateSchoolInput,
    ): Promise<School> {
        this.logger.log(ctx, `${this.create.name} was called`);

        const exists = await this.repository.existsBy({ taxId: create.taxId });
        if (exists) {
            throw new UnprocessableEntityException();
        }

        const school = plainToInstance(School, create);

        const actor: Actor = ctx.user!;
        const isAllowed = this.aclService
            .forActor(actor)
            .withContext(ctx)
            .canDoAction(Action.Create);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const savedSchool = await this.repository.save(school);

        const user = await this.userService.getUserById(ctx, ctx.user!.id);
        if (!user) {
            throw new InternalServerErrorException();
        }
        await this.schoolMemberService.create(ctx, savedSchool.id, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            taxId: user.taxId,
            dateOfBirth: user.dateOfBirth,
            role: ESchoolRole.ADMIN,
        });

        return savedSchool;
    }

    async update(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
        update: UpdateSchoolInput,
    ): Promise<School> {
        this.logger.log(ctx, `${this.update.name} was called`);

        const school = await this.repository.getById(schoolId);

        const actor: Actor = ctx.user!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .withContext(ctx)
            .canDoAction(Action.Update, school);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        const updatedSchool = await this.repository.save({
            ...school,
            ...update,
        });

        return updatedSchool;
    }

    async delete(
        ctx: AuthenticatedRequestContext,
        schoolId: number,
    ): Promise<void> {
        this.logger.log(ctx, `${this.delete.name} was called`);

        const school = await this.repository.getById(schoolId);

        const actor: Actor = ctx.user!;
        const isAllowed = await this.aclService
            .forActor(actor)
            .withContext(ctx)
            .canDoAction(Action.Delete, school);
        if (!isAllowed) {
            throw new ForbiddenException();
        }

        await this.repository.softDelete(schoolId);
    }
}
