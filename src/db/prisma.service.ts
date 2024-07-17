import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    FilterSoftDeleted,
    SoftDelete,
    SoftDeleteMany,
} from './prisma.extensions';
import { PrismaClientExtended } from './prisma-extended.client';

@Injectable()
export class PrismaService
    extends PrismaClientExtended
    implements OnModuleInit
{
    async onModuleInit() {
        await this.$extends(SoftDelete)
            .$extends(SoftDeleteMany)
            .$extends(FilterSoftDeleted)
            .$connect();
    }
}
