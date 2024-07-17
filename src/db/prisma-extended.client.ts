import { PrismaClient } from '@prisma/client';
import {
    FilterSoftDeleted,
    SoftDelete,
    SoftDeleteMany,
} from './prisma.extensions';

export const CustomPrismaClient = (prismaClient: PrismaClient) => {
    return prismaClient
        .$extends(FilterSoftDeleted)
        .$extends(SoftDelete)
        .$extends(SoftDeleteMany);
};

export class PrismaClientExtended extends PrismaClient {
    customPrismaClient: CustomPrismaClient;

    get client() {
        if (!this.customPrismaClient) {
            this.customPrismaClient = CustomPrismaClient(this);
        }

        return this.customPrismaClient;
    }
}

export type CustomPrismaClient = ReturnType<typeof CustomPrismaClient>;
