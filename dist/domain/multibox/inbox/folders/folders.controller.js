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
exports.FoldersController = void 0;
const common_1 = require("@nestjs/common");
const nylas_service_1 = require("../../../nylas/nylas.service");
const passport_1 = require("@nestjs/passport");
const grants_service_1 = require("../grants/grants.service");
const service_error_codes_1 = require("../../../../common/utils/enums/service-error-codes");
let FoldersController = class FoldersController {
    constructor(nylasService, grantService) {
        this.nylasService = nylasService;
        this.grantService = grantService;
    }
    async findAll(req, grantId) {
        const userId = req.user.id;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new common_1.UnauthorizedException('Invalid grantId provided');
            }
            const { data } = await this.nylasService.fetchFolders(grant.grantId);
            if (!data) {
                return [];
            }
            return data.map((folder) => {
                return {
                    id: folder.id,
                    name: folder.name,
                    attributes: folder.attributes,
                    totalCount: folder.totalCount,
                    unreadCount: folder.unreadCount,
                    systemFolder: folder.systemFolder,
                };
            });
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
};
exports.FoldersController = FoldersController;
__decorate([
    (0, common_1.Get)(':grantId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "findAll", null);
exports.FoldersController = FoldersController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('folders'),
    __metadata("design:paramtypes", [nylas_service_1.NylasService,
        grants_service_1.GrantsService])
], FoldersController);
//# sourceMappingURL=folders.controller.js.map