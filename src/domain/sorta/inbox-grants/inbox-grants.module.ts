import { Module } from '@nestjs/common';
import { InboxGrantsService } from './inbox-grants.service';
import { InboxGrantsController } from './inbox-grants.controller';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
    controllers: [InboxGrantsController],
    providers: [InboxGrantsService],
    imports: [PrismaModule],
    exports: [InboxGrantsService],
})
export class InboxGrantsModule {}
