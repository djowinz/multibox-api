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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const nylas_service_1 = require("../../../nylas/nylas.service");
const grants_service_1 = require("../grants/grants.service");
const service_error_codes_1 = require("../../../../common/utils/enums/service-error-codes");
const passport_1 = require("@nestjs/passport");
const update_message_dto_1 = require("./dto/update-message.dto");
const bulk_update_message_dto_1 = require("./dto/bulk-update-message.dto");
let MessagesController = class MessagesController {
    constructor(nylasService, grantService) {
        this.nylasService = nylasService;
        this.grantService = grantService;
    }
    async findOne(req, grantId, messageId) {
        const userId = req.user.id;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            return await this.nylasService.fetchMessage(grant.grantId, messageId);
        }
        catch (error) {
            if (error.code === service_error_codes_1.ServiceErrorCode.Prisma_Unknown) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (error.code === service_error_codes_1.ServiceErrorCode.Nylas_Message_Retrival_Error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async findAll(req, grantId, folderId, cursor, filter) {
        const userId = req.user.id;
        const filterDecoded = filter ? decodeURI(filter) : '';
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            return await this.nylasService.fetchThreads(grant.grantId, folderId, 50, cursor ? cursor : '', filterDecoded);
        }
        catch (error) {
            if (error.code === service_error_codes_1.ServiceErrorCode.Prisma_Unknown) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (error.code === service_error_codes_1.ServiceErrorCode.Nylas_Folder_Retrival_Error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async update(req, grantId, objectId, objectType, updateMessageDto) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            return await this.nylasService.updateObjectAttributes(grant.grantId, objectId, updateMessageDto, isMessageObject);
        }
        catch (error) {
            if (error.code === service_error_codes_1.ServiceErrorCode.Prisma_Unknown) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (error.code === service_error_codes_1.ServiceErrorCode.Nylas_Object_Patch_Error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async delete(req, grantId, objectId, objectType) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            return await this.nylasService.deleteObject(grant.grantId, objectId, isMessageObject);
        }
        catch (error) {
            if (error.code === service_error_codes_1.ServiceErrorCode.Prisma_Unknown) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (error.code === service_error_codes_1.ServiceErrorCode.Nylas_Object_Delete_Error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async updateBulk(req, grantId, objectType, bulkUpdateMessageDto) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';
        const { objectIds, update } = bulkUpdateMessageDto;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            return Promise.all(objectIds.map((objectId) => this.nylasService.updateObjectAttributes(grant.grantId, objectId, update, isMessageObject)));
        }
        catch (error) {
            if (error.code === service_error_codes_1.ServiceErrorCode.Prisma_Unknown) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (error.code === service_error_codes_1.ServiceErrorCode.Nylas_Object_Patch_Error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async deleteBulk(req, grantId, objectType, bulkDeleteDto) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';
        const { objectIds } = bulkDeleteDto;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            return Promise.all(objectIds.map((objectId) => this.nylasService.deleteObject(grant.grantId, objectId, isMessageObject)));
        }
        catch (error) {
            if (error.code === service_error_codes_1.ServiceErrorCode.Prisma_Unknown) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (error.code === service_error_codes_1.ServiceErrorCode.Nylas_Object_Delete_Error) {
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Get)(':grantId/:messageId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':grantId/folder/:folderId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Param)('folderId')),
    __param(3, (0, common_1.Query)('cursor')),
    __param(4, (0, common_1.Query)('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':grantId/:objectId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Param)('objectId')),
    __param(3, (0, common_1.Query)('objectType')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, update_message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':grantId/:objectId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Param)('objectId')),
    __param(3, (0, common_1.Query)('objectType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':grantId/bulk/update'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Query)('objectType')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, bulk_update_message_dto_1.BulkUpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "updateBulk", null);
__decorate([
    (0, common_1.Put)(':grantId/bulk/delete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Query)('objectType')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "deleteBulk", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [nylas_service_1.NylasService,
        grants_service_1.GrantsService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map