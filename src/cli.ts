import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DateTime } from 'luxon';

import { AppModule } from './app.module';
import { ERole } from './auth/constants/role.constant';
import { RequestContext } from './shared/request-context/request-context.dto';
import { CreateUserInput } from './user/dtos/user-create-input.dto';
import { UserService } from './user/services/user.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const configService = app.get(ConfigService);
    const defaultAdminUserPassword = configService.get<string>(
        'defaultAdminUserPassword',
    )!;

    const userService = app.get(UserService);

    const defaultAdmin: CreateUserInput = {
        firstName: 'Default Admin',
        password: defaultAdminUserPassword,
        dateOfBirth: DateTime.now(),
        role: ERole.ADMIN,
        email: 'default@admin.com',
    };

    const ctx = {} as RequestContext;

    // Create the default admin user if it doesn't already exist.
    const user = await userService.findByEmail(ctx, defaultAdmin.email);
    if (!user) {
        await userService.createUser(ctx, defaultAdmin);
    }

    await app.close();
}

bootstrap();
