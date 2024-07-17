import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import nylasConfig from 'src/config/nylas.config';
import { NylasService } from './nylas.service';

@Module({
    imports: [ConfigModule.forFeature(nylasConfig)],
    providers: [NylasService],
    exports: [NylasService],
})
export class NylasModule {}
