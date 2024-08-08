import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { NylasModule } from 'src/domain/nylas/nylas.module';
import { GrantsModule } from '../grants/grants.module';

@Module({
    controllers: [MessagesController],
    imports: [NylasModule, GrantsModule],
})
export class MessagesModule {}
