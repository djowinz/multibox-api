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
            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to fetch folders: ${error.message}`,
                ServiceErrorCode.Nylas_Folder_Retrival_Error,
            );
        }
    }

    async updateObjectAttributes(
        grantId: string,
        objectId: string,
        update: any,
        isMessage: boolean,
    ) {
        try {
            let resp = null;
            if (isMessage) {
                resp = await this.ny.messages.update({
                    identifier: grantId,
                    messageId: objectId,
                    requestBody: update,
                });

                console.log(resp);
            } else {
                resp = await this.ny.threads.update({
                    identifier: grantId,
                    threadId: objectId,
                    requestBody: update,
                });

                console.log(resp);
            }

            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to update ${isMessage ? 'message' : 'thread'} attributes: ${error.message}`,
                ServiceErrorCode.Nylas_Object_Patch_Error,
            );
        }
    }

    async deleteObject(grantId: string, objectId: string, isMessage: boolean) {
        try {
            let resp = null;
            if (isMessage) {
                resp = await this.ny.messages.destroy({
                    identifier: grantId,
                    messageId: objectId,
                });
            } else {
                resp = await this.ny.threads.destroy({
                    identifier: grantId,
                    threadId: objectId,
                });
            }

            return resp;
        } catch (error) {
            throw new ServiceError(
                `Failed to delete ${isMessage ? 'message' : 'thread'}: ${error.message}`,
                ServiceErrorCode.Nylas_Object_Delete_Error,
            );
        }
    }

    async fetchMessage(grantId: string, messagesId: string) {
        try {
            return await this.ny.messages.find({
                identifier: grantId,
                messageId: messagesId,
            });
        } catch (error) {
            console.error(error);
            throw new ServiceError(
                `Failed to fetch message: ${error.message}`,
                ServiceErrorCode.Nylas_Message_Retrival_Error,
            );
        }
    }

    async fetchThreads(
        grantId: string,
        folderId: string,
        limit: number,
        pageCursor?: string,
        filter?: string,
    ) {
        try {
            const resp = await this.ny.threads.list({
                identifier: grantId,
                queryParams: {
                    limit,
                    in: [folderId],
                    searchQueryNative: filter,
                    pageToken: pageCursor,
                },
            });

            return resp;
        } catch (error) {
            console.error(error);
            throw new ServiceError(
                `Failed to fetch threads: ${error.message}`,
                ServiceErrorCode.Nylas_Thread_Retrival_Error,
            );
        }
    }
}
