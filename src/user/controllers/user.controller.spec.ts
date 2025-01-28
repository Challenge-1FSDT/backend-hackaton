import { Test, TestingModule } from '@nestjs/testing';

import { ERole } from '../../auth/constants/role.constant';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../dtos/user-output.dto';
import { UpdateUserSelfInput } from '../dtos/user-update-self-input.dto';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
    let controller: UserController;
    const mockedUserService = {
        getUsers: jest.fn(),
        getUserById: jest.fn(),
        updateUser: jest.fn(),
    };

    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: mockedUserService },
                { provide: AppLogger, useValue: mockedLogger },
            ],
        }).compile();

        controller = moduleRef.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    const ctx = new RequestContext();

    describe('get Users as a list', () => {
        it('Calls getUsers function', () => {
            const query: PaginationParamsDto = {
                offset: 0,
                limit: 0,
            };
            mockedUserService.getUsers.mockResolvedValue({
                users: [],
                count: 0,
            });
            controller.getUsers(ctx, query);
            expect(mockedUserService.getUsers).toHaveBeenCalled();
        });
    });

    const currentDate = new Date().toString();

    const expectedOutput: User = {
        id: 1,
        username: 'default-user',
        name: 'default-name',
        roles: [ERole.USER],
        isDisabled: false,
        email: 'e2etester@random.com',
        createdAt: currentDate,
        updatedAt: currentDate,
    };

    describe('Get user by id', () => {
        it('should call service method getUserById with id', async () => {
            const id = 1;
            mockedUserService.getUserById.mockResolvedValue(expectedOutput);

            expect(await controller.getUser(ctx, id)).toEqual({
                data: expectedOutput,
                meta: {},
            });
            expect(mockedUserService.getUserById).toHaveBeenCalledWith(ctx, id);
        });
    });

    describe('Update user by id', () => {
        it('Update user by id and returns user', async () => {
            const input = new UpdateUserSelfInput();
            mockedUserService.updateUser.mockResolvedValue(expectedOutput);

            expect(await controller.updateUser(ctx, 1, input)).toEqual({
                data: expectedOutput,
                meta: {},
            });
        });
    });
});
