import { AppLogger } from '../../shared/logger/logger.service';
import { SchoolService } from '../services/school.service';

export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SchoolController.name);
  }
}
