import { DataSource, Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceRepository extends Repository<Attendance> {
    constructor(private readonly dataSource: DataSource) {
        super(Attendance, dataSource.createEntityManager());
    }
}
