import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ERole } from '../../auth/constants/role.constant';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName?: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  phone?: string;

  @Expose()
  @ApiProperty()
  taxId?: string;

  @Expose()
  @ApiProperty({ example: ERole.USER })
  role: ERole;

  @Expose()
  @ApiProperty()
  isDisabled: boolean;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;

  @Expose()
  @ApiProperty()
  deletedAt?: string;
}
