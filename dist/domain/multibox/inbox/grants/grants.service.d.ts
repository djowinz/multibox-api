import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';
export declare class GrantsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: Prisma.InboxGrantCreateInput): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }>;
    findAll(userId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }>;
    update(userId: string, id: string, data: Prisma.InboxGrantUpdateInput): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }>;
    remove(ownerId: string, id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }>;
}
