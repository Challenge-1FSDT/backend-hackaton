import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';

import { isValidNumber } from '../../shared/typeguards';

@Injectable()
export class SchoolIdGuard implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const schoolId = Number(
            request.params.schoolId || request.query.schoolId,
        );
        if (!isValidNumber(schoolId)) {
            throw new BadRequestException('schoolId must be provided');
        }

        return isValidNumber(schoolId);
    }
}
