import { PrismaService } from 'src/db/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserByEmail(email: string): Promise<User>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    upsertViaAuth(data: Prisma.UserCreateInput): Promise<User | null>;
    deleteUser(id: string): Promise<User>;
}
