import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';
import { ServiceError } from 'src/common/utils/custom.error';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class GrantsService {
    private readonly logger = new Logger(GrantsService.name);
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.InboxGrantCreateInput) {
        try {
            return await this.prisma.client.inboxGrant.create({ data });
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to create inboxGrant',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async findAll(userId: string) {
        try {
            const grants = await this.prisma.client.inboxGrant.findMany({
                where: {
                    ownerId: userId,
                },
            });
            return grants;
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to fetch inboxGrants',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async findOne(userId: string, id: string) {
        try {
            return await this.prisma.client.inboxGrant.findUnique({
                where: {
                    ownerId: userId,
                    id,
                },
            });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            if (prismaError.code === ServiceErrorCode.Prisma_P2018) {
                this.logger.debug(`InboxGrant: ${id} not found`);
                throw new ServiceError(
                    `InboxGrant: ${id} not found`,
                    ServiceErrorCode.Prisma_P2018,
                );
            }
            this.logger.error(error);
            throw new ServiceError(
                'Failed to fetch inboxGrant',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async update(
        userId: string,
        id: string,
        data: Prisma.InboxGrantUpdateInput,
    ) {
        try {
            return await this.prisma.client.inboxGrant.update({
                data,
                where: {
                    ownerId: userId,
                    id,
                },
            });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            if (prismaError.code === ServiceErrorCode.Prisma_P2018) {
                this.logger.debug(`InboxGrant: ${id} not found`);
                throw new ServiceError(
                    `InboxGrant: ${id} not found`,
                    ServiceErrorCode.Prisma_P2018,
                );
            }
            this.logger.error(error);
            throw new ServiceError(
                'Failed to update inboxGrant',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async remove(ownerId: string, id: string) {
        try {
            return await this.prisma.client.inboxGrant.delete({
                ownerId,
                id,
            });
        } catch (error) {
            const prismaError = error as PrismaClientKnownRequestError;
            if (prismaError.code === ServiceErrorCode.Prisma_P2018) {
                this.logger.debug(`InboxGrant: ${id} not found`);
                throw new ServiceError(
                    `InboxGrant: ${id} not found`,
                    ServiceErrorCode.Prisma_P2018,
                );
            }
            this.logger.error(error);
            throw new ServiceError(
                'Failed to delete inboxGrant',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }
}
