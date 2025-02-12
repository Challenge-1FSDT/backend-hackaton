import { ESchoolRole } from './constants/schoolRole.constant';

const schoolRoleWeight = {
    [ESchoolRole.ADMIN]: 100,
    [ESchoolRole.FACULTY]: 50,
    [ESchoolRole.TEACHER]: 5,
    [ESchoolRole.STUDENT]: 1,
};

export function isOfHigherRole(role1: ESchoolRole, role2: ESchoolRole) {
    const roleWeight1 = schoolRoleWeight[role1];
    const roleWeight2 = schoolRoleWeight[role2];
    return roleWeight1 > roleWeight2;
}

export function isOfHigherOrEqualRole(role1: ESchoolRole, role2: ESchoolRole) {
    const roleWeight1 = schoolRoleWeight[role1];
    const roleWeight2 = schoolRoleWeight[role2];
    return roleWeight1 >= roleWeight2;
}
