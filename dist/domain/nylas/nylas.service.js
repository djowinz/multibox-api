"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NylasService = void 0;
const nylas_1 = require("nylas");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const custom_error_1 = require("../../common/utils/custom.error");
const service_error_codes_1 = require("../../common/utils/enums/service-error-codes");
let NylasService = class NylasService {
    constructor(configService) {
        this.configService = configService;
        this.ny = new nylas_1.default({
            apiKey: this.configService.get('nylas.clientSecret'),
            apiUri: this.configService.get('nylas.apiUri'),
        });
    }
    async exchangeCodeForToken(code, redirectUri) {
        try {
            const resp = await this.ny.auth.exchangeCodeForToken({
                clientId: this.configService.get('nylas.clientId'),
                clientSecret: this.configService.get('nylas.clientSecret'),
                code,
                redirectUri,
            });
            return resp;
        }
        catch (error) {
            throw new custom_error_1.ServiceError(`Failed to exchange code for token: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Token_Exchange_Error);
        }
    }
    async deleteGrant(grantId) {
        try {
            const resp = await this.ny.grants.destroy({ grantId });
            return resp;
        }
        catch (error) {
            throw new custom_error_1.ServiceError(`Failed to delete grant: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Token_Revoke_Error);
        }
    }
    async fetchFolders(grantId) {
        try {
            const resp = await this.ny.folders.list({ identifier: grantId });
            return resp;
        }
        catch (error) {
            throw new custom_error_1.ServiceError(`Failed to fetch folders: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Folder_Retrival_Error);
        }
    }
    async updateObjectAttributes(grantId, objectId, update, isMessage) {
        try {
            let resp = null;
            if (isMessage) {
                resp = await this.ny.messages.update({
                    identifier: grantId,
                    messageId: objectId,
                    requestBody: update,
                });
                console.log(resp);
            }
            else {
                resp = await this.ny.threads.update({
                    identifier: grantId,
                    threadId: objectId,
                    requestBody: update,
                });
                console.log(resp);
            }
            return resp;
        }
        catch (error) {
            throw new custom_error_1.ServiceError(`Failed to update ${isMessage ? 'message' : 'thread'} attributes: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Object_Patch_Error);
        }
    }
    async deleteObject(grantId, objectId, isMessage) {
        try {
            let resp = null;
            if (isMessage) {
                resp = await this.ny.messages.destroy({
                    identifier: grantId,
                    messageId: objectId,
                });
            }
            else {
                resp = await this.ny.threads.destroy({
                    identifier: grantId,
                    threadId: objectId,
                });
            }
            return resp;
        }
        catch (error) {
            throw new custom_error_1.ServiceError(`Failed to delete ${isMessage ? 'message' : 'thread'}: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Object_Delete_Error);
        }
    }
    async fetchMessage(grantId, messagesId) {
        try {
            return await this.ny.messages.find({
                identifier: grantId,
                messageId: messagesId,
            });
        }
        catch (error) {
            console.error(error);
            throw new custom_error_1.ServiceError(`Failed to fetch message: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Message_Retrival_Error);
        }
    }
    async fetchThreads(grantId, folderId, limit, pageCursor, filter) {
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
        }
        catch (error) {
            console.error(error);
            throw new custom_error_1.ServiceError(`Failed to fetch threads: ${error.message}`, service_error_codes_1.ServiceErrorCode.Nylas_Thread_Retrival_Error);
        }
    }
};
exports.NylasService = NylasService;
exports.NylasService = NylasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NylasService);
//# sourceMappingURL=nylas.service.js.map