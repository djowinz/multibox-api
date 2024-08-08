import { OnModuleInit } from '@nestjs/common';
import { PrismaClientExtended } from './prisma-extended.client';
export declare class PrismaService extends PrismaClientExtended implements OnModuleInit {
    onModuleInit(): Promise<void>;
}
