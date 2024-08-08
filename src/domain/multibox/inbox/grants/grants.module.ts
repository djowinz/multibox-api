import { Module } from '@nestjs/common';
import { GrantsService } from './grants.service';
import { GrantsController } from './grants.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { NylasModule } from 'src/domain/nylas/nylas.module';

@Module({
    controllers: [GrantsController],
    providers: [GrantsService],
    imports: [PrismaModule, NylasModule],
    exports: [GrantsService],
})
export class GrantsModule {}
