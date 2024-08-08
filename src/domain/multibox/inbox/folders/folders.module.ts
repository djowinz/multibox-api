import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { NylasModule } from 'src/domain/nylas/nylas.module';
import { GrantsModule } from '../grants/grants.module';

@Module({
  controllers: [FoldersController],
  imports: [NylasModule, GrantsModule],
})
export class FoldersModule {}
