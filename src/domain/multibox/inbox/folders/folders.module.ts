import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { NylasModule } from 'src/domain/nylas/nylas.module';
import { GrantsModule } from '../grants/grants.module';
import { FoldersService } from './folders.service';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
    controllers: [FoldersController],
    providers: [FoldersService],
    imports: [NylasModule, GrantsModule, PrismaModule],
})
export class FoldersModule {}
