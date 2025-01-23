import { Test, TestingModule } from '@nestjs/testing';

import { Article } from '../../article/entities/article.entity';
import { ERole } from './../../auth/constants/role.constant';
import { BaseAclService } from './acl.service';
import { RuleCallback } from './acl-rule.constant';
import { Action } from './action.constant';

class MockResource {
    id: number;
}

class MockAclService extends BaseAclService<MockResource> {
    public canDo(
        role: ERole,
        actions: Action[],
        ruleCallback?: RuleCallback<MockResource>,
    ) {
        super.canDo(role, actions, ruleCallback);
    }

    public getAclRules() {
        return this.aclRules;
    }
}

describe('AclService', () => {
    let service: MockAclService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MockAclService],
        }).compile();

        service = module.get<MockAclService>(MockAclService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('canDo', () => {
        it('should add acl rule', () => {
            service.canDo(ERole.USER, [Action.Read]);
            const aclRules = service.getAclRules();
            expect(aclRules).toContainEqual({
                role: ERole.USER,
                actions: [Action.Read],
            });
        });

        it('should add acl rule with custom rule', () => {
            const ruleCallback = jest.fn();

            service.canDo(ERole.USER, [Action.Read], ruleCallback);

            const aclRules = service.getAclRules();

            expect(aclRules).toContainEqual({
                role: ERole.USER,
                actions: [Action.Read],
                ruleCallback,
            });
        });
    });

    describe('forActor', () => {
        const user = {
            id: 6,
            username: 'foo',
            roles: [ERole.USER],
        };

        const admin = {
            id: 7,
            username: 'admin',
            roles: [ERole.ADMIN],
        };

        it('should return canDoAction method', () => {
            const userAcl = service.forActor(user);
            expect(userAcl.canDoAction).toBeDefined();
        });

        it('should return false when no role sepcific rules found', () => {
            service.canDo(ERole.USER, [Action.Read]);
            const userAcl = service.forActor(admin);
            expect(userAcl.canDoAction(Action.Read)).toBeFalsy();
        });

        it('should return false when no action sepcific rules found', () => {
            service.canDo(ERole.USER, [Action.Read]);
            const userAcl = service.forActor(user);
            expect(userAcl.canDoAction(Action.Create)).toBeFalsy();
        });

        it('should return true when role has action permission', () => {
            service.canDo(ERole.USER, [Action.Read]);
            const userAcl = service.forActor(user);
            expect(userAcl.canDoAction(Action.Read)).toBeTruthy();
        });

        it('should return true when ruleCallback is true', () => {
            const customOwnerRule = jest.fn();
            customOwnerRule.mockReturnValue(true);
            service.canDo(ERole.USER, [Action.Manage], customOwnerRule);
            const userAcl = service.forActor(user);
            expect(
                userAcl.canDoAction(Action.Read, new Article()),
            ).toBeTruthy();
        });

        it('should return false when ruleCallback is false', () => {
            const customOwnerRule = jest.fn();
            customOwnerRule.mockReturnValue(false);
            service.canDo(ERole.USER, [Action.Manage], customOwnerRule);
            const userAcl = service.forActor(user);
            expect(userAcl.canDoAction(Action.Read, new Article())).toBeFalsy();
        });
    });
});
