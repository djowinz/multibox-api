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

    async exchangeCodeForToken(code: string, redirectUri: string) {
        try {
            const resp = await this.ny.auth.exchangeCodeForToken({
                clientId: this.configService.get<string>('nylas.clientId'),
                clientSecret:
                    this.configService.get<string>('nylas.clientSecret'),
                code,
                redirectUri,
            });
            console.log(resp);

            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to exchange code for token: ${error.message}`,
                ServiceErrorCode.Nylas_Token_Exchange_Error,
            );
        }
    }

    async deleteGrant(grantId: string) {
        try {
            const resp = await this.ny.grants.destroy({ grantId });
            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to delete grant: ${error.message}`,
                ServiceErrorCode.Nylas_Token_Revoke_Error,
            );
        }
    }

    async fetchFolders(grantId: string) {
        try {
            const resp = await this.ny.folders.list({ identifier: grantId });
            console.log(grantId);
            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to fetch folders: ${error.message}`,
                ServiceErrorCode.Nylas_Folder_Retrival_Error,
            );
        }
    }

    async updateMessageFolder(
        grantId: string,
        messageId: string,
        folderId: string,
    ) {
        try {
            const resp = await this.ny.messages.update({
                identifier: grantId,
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
        grantId: string,
        pageCursor: string,
        limit: number,
        filter?: string[],
    ) {
        try {
            const resp = await this.ny.threads.list({
                identifier: grantId,
                queryParams: {
                    limit,
                    in: filter,
                    pageToken: pageCursor,
                },
            });

            return resp;
        } catch (error) {
            console.log(error);
            throw new ServiceError(
                `Failed to fetch threads: ${error.message}`,
                ServiceErrorCode.Nylas_Thread_Retrival_Error,
            );
        }
    }
}
