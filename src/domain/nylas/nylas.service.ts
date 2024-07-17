import Nylas from 'nylas';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceError } from 'src/common/utils/custom.error';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';

@Injectable()
export class NylasService {
    private ny: Nylas;
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;

        this.ny = new Nylas({
            apiKey: this.configService.get<string>('nylas.clientSecret'),
            apiUri: this.configService.get<string>('nylas.apiUri'),
        });
    }

    async exchangeCodeForToken(code: string) {
        try {
            const resp = await this.ny.auth.exchangeCodeForToken({
                clientId: this.configService.get<string>('nylas.clientId'),
                clientSecret:
                    this.configService.get<string>('nylas.clientSecret'),
                code,
                redirectUri:
                    this.configService.get<string>('nylas.redirectUri'),
            });

            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to exchange code for token: ${error.message}`,
                ServiceErrorCode.Nylas_Token_Exchange_Error,
            );
        }
    }

    async deleteGrant(grantToken: string) {
        try {
            const resp = await this.ny.grants.destroy({ grantId: grantToken });
            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to delete grant: ${error.message}`,
                ServiceErrorCode.Nylas_Token_Revoke_Error,
            );
        }
    }

    async fetchFolders(grantToken: string) {
        try {
            const resp = await this.ny.folders.list({ identifier: grantToken });
            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to fetch folders: ${error.message}`,
                ServiceErrorCode.Nylas_Folder_Retrival_Error,
            );
        }
    }

    async updateMessageFolder(
        grantToken: string,
        messageId: string,
        folderId: string,
    ) {
        try {
            const resp = await this.ny.messages.update({
                identifier: grantToken,
                messageId,
                requestBody: {
                    folders: [folderId],
                },
            });

            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to update message folder: ${error.message}`,
                ServiceErrorCode.Nylas_Folder_Patch_Error,
            );
        }
    }

    async fetchThreads(
        grantToken: string,
        pageCursor: string,
        limit: number,
        filter?: string[],
    ) {
        try {
            const resp = await this.ny.threads.list({
                identifier: grantToken,
                queryParams: {
                    limit,
                    in: filter,
                    pageToken: pageCursor,
                },
            });

            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to fetch threads: ${error.message}`,
                ServiceErrorCode.Nylas_Thread_Retrival_Error,
            );
        }
    }
}
