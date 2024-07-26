import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { NylasModule } from './domain/nylas/nylas.module';
import { UsersModule } from './domain/sorta/users/users.module';
import { GrantsModule } from './domain/sorta/inbox/grants/grants.module';
import { FoldersModule } from './domain/sorta/inbox/folders/folders.module';
import { MessagesModule } from './domain/sorta/inbox/messages/messages.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
        }),
        NylasModule,
        AuthModule,
        UsersModule,
        GrantsModule,
        FoldersModule,
        MessagesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
