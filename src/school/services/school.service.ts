import { Injectable } from '@nestjs/common';

import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolRepository } from '../repositories/school.repository';

@Injectable()
export class SchoolService {
  public constructor(
    private readonly repository: SchoolRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SchoolService.name);
  }
}
