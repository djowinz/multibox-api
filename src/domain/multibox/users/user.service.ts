import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ServiceError } from 'src/common/utils/custom.error';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserByEmail(email: string): Promise<User> {
        try {
            return await this.prisma.client.user.findUnique({
                where: {
                    email,
                },
            });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            if (prismaError.code === ServiceErrorCode.Prisma_P2018) {
                throw new ServiceError(
                    `Email: ${email} not found`,
                    ServiceErrorCode.Prisma_P2018,
                );
            }
            throw new ServiceError(
                'Failed to fetch user by email',
                ServiceErrorCode.Unknown,
            );
        }
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        try {
            return await this.prisma.client.user.update({
                data,
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new ServiceError(
                'Failed to update user',
                ServiceErrorCode.Unknown,
            );
        }
    }

    async upsertViaAuth(data: Prisma.UserCreateInput): Promise<User | null> {
        try {
            return await this.prisma.client.user.upsert({
                where: {
                    email: data.email,
                },
                update: {
                    lastLogin: new Date().toISOString(),
                },
                create: data,
            });
        } catch (error) {
            throw new ServiceError(
                'Failed to create user',
                ServiceErrorCode.Unknown,
            );
        }
    }

    async deleteUser(id: string): Promise<User> {
        try {
            return await this.prisma.client.user.delete({
                id,
            });
        } catch (error) {
            throw new ServiceError(
                'Failed to delete user',
                ServiceErrorCode.Unknown,
            );
        }
    }
}
