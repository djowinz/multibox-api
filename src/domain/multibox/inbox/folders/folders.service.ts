import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { InboxLabel, Prisma } from '@prisma/client';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { ServiceError } from 'src/common/utils/custom.error';

@Injectable()
export class FoldersService {
    private readonly logger = new Logger(FoldersService.name);
    constructor(private prisma: PrismaService) {}

    async findAll(userId: string, grantId: string) {
        try {
            const folders = await this.prisma.client.inboxLabel.findMany({
                where: {
                    ownerId: userId,
                    inboxGrantId: grantId,
                },
            });
            return folders;
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to fetch folders',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async findbyProviderId(userId: string, providerId: string) {
        try {
            return await this.prisma.client.inboxLabel.findFirst({
                where: {
                    ownerId: userId,
                    folderId: providerId,
                },
            });
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to fetch folder by providerId',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async create(data: Prisma.InboxLabelCreateInput): Promise<InboxLabel> {
        try {
            return await this.prisma.client.inboxLabel.create({ data });
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to create inboxLabel',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async update(
        userId: string,
        id: string,
        data: Prisma.InboxLabelUpdateInput,
    ) {
        try {
            return await this.prisma.client.inboxLabel.update({
                where: {
                    ownerId: userId,
                    id,
                },
                data,
            });
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to update inboxLabel',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }

    async remove(ownerId: string, id: string) {
        try {
            return await this.prisma.client.inboxLabel.deleteMany({
                ownerId,
                folderId: id,
            });
        } catch (error) {
            this.logger.error(error);
            throw new ServiceError(
                'Failed to delete inboxLabel',
                ServiceErrorCode.Prisma_Unknown,
            );
        }
    }
}
