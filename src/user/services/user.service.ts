import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateUserInput } from '../dtos/user-create-input.dto';
import { UpdateUserInput } from '../dtos/user-update-input.dto';
import { UpdateUserSelfInput } from '../dtos/user-update-self-input.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
    constructor(
        private repository: UserRepository,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(UserService.name);
    }

    async createUser(
        ctx: RequestContext,
        input: CreateUserInput,
    ): Promise<User> {
        this.logger.log(ctx, `${this.createUser.name} was called`);

        const user = plainToClass(User, input);

        user.password = await hash(
            input.password ?? input.dateOfBirth.toFormat('ddMMyyyy'),
            10,
        );

        this.logger.log(ctx, `calling ${UserRepository.name}.saveUser`);
        const createdUser = await this.repository.save(user);

        return createdUser;
    }

    async validateEmailPassword(
        ctx: RequestContext,
        email: string,
        pass: string,
    ): Promise<User> {
        this.logger.log(ctx, `${this.validateEmailPassword.name} was called`);

        this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
        const user = await this.repository.findOne({ where: { email } });
        if (!user) throw new UnauthorizedException();

        const match = await compare(pass, user.password);
        if (!match) throw new UnauthorizedException();

        return plainToClass(User, user, {
            excludeExtraneousValues: true,
        });
    }

    async getUsers(
        ctx: RequestContext,
        limit: number,
        offset: number,
    ): Promise<{ users: User[]; count: number }> {
        this.logger.log(ctx, `${this.getUsers.name} was called`);

        this.logger.log(ctx, `calling ${UserRepository.name}.findAndCount`);
        const [users, count] = await this.repository.findAndCount({
            where: {},
            take: limit,
            skip: offset,
        });

        const usersOutput = plainToInstance(User, users, {
            excludeExtraneousValues: true,
        });

        return { users: usersOutput, count };
    }

    async findById(ctx: RequestContext, id: number): Promise<User | null> {
        this.logger.log(ctx, `${this.findById.name} was called`);

        this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
        const user = await this.repository.findOne({ where: { id } });

        return user;
    }

    async getUserById(ctx: RequestContext, id: number): Promise<User | null> {
        this.logger.log(ctx, `${this.getUserById.name} was called`);

        this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
        const user = await this.repository.getById(id);

        return user;
    }

    async findByEmail(
        ctx: RequestContext,
        email: string,
    ): Promise<User | null> {
        this.logger.log(ctx, `${this.findByEmail.name} was called`);

        this.logger.log(ctx, `calling ${UserRepository.name}.findOne`);
        const user = await this.repository.findOne({ where: { email } });

        return user;
    }

    async updateUser(
        ctx: RequestContext,
        userId: number,
        input: UpdateUserInput | UpdateUserSelfInput,
    ): Promise<User> {
        this.logger.log(ctx, `${this.updateUser.name} was called`);

        this.logger.log(ctx, `calling ${UserRepository.name}.getById`);
        const user = await this.repository.getById(userId);

        // Hash the password if it exists in the input payload.
        if (input.password) {
            input.password = await hash(input.password, 10);
        }

        // merges the input (2nd line) to the found user (1st line)
        const updatedUser: User = {
            ...user,
            ...JSON.parse(JSON.stringify(input)), // remove undefineds
        };

        this.logger.log(ctx, `calling ${UserRepository.name}.save`);
        const result = await this.repository.save(updatedUser);

        return result;
    }
}
