import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { NylasModule } from './domain/nylas/nylas.module';
import { UsersModule } from './domain/sorta/users/users.module';
import { InboxGrantsModule } from './inbox-grants/inbox-grants.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
        }),
        NylasModule,
        AuthModule,
        UsersModule,
        InboxGrantsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
