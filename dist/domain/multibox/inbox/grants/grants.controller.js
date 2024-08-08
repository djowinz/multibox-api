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
exports.GrantsController = void 0;
const common_1 = require("@nestjs/common");
const grants_service_1 = require("./grants.service");
const create_grant_dto_1 = require("./dto/create-grant.dto");
const nylas_service_1 = require("../../../nylas/nylas.service");
const passport_1 = require("@nestjs/passport");
const service_error_codes_1 = require("../../../../common/utils/enums/service-error-codes");
let GrantsController = class GrantsController {
    constructor(inboxGrantsService, nylasService) {
        this.inboxGrantsService = inboxGrantsService;
        this.nylasService = nylasService;
    }
    async create(req, createInboxGrantDto) {
        const userId = req.user.id;
        try {
            const tokenExchange = await this.nylasService.exchangeCodeForToken(createInboxGrantDto.claimToken, createInboxGrantDto.redirectUri);
            return await this.inboxGrantsService.create({
                Owner: {
                    connect: {
                        id: userId,
                    },
                },
                emailProvider: tokenExchange.provider,
                email: tokenExchange.email,
                grantId: tokenExchange.grantId,
                refreshToken: '',
                deletedAt: null,
            });
        }
        catch (error) {
            if (Object(error).hasOwnProperty('code') &&
                error.code === service_error_codes_1.ServiceErrorCode.Nylas_Token_Exchange_Error) {
                throw new common_1.BadRequestException(error.message);
            }
            else {
                throw new common_1.InternalServerErrorException(error.message);
            }
        }
    }
    async findAll(req) {
        const userId = req.user.id;
        return await this.inboxGrantsService.findAll(userId);
    }
};
exports.GrantsController = GrantsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_grant_dto_1.CreateGrantDto]),
    __metadata("design:returntype", Promise)
], GrantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GrantsController.prototype, "findAll", null);
exports.GrantsController = GrantsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('grants'),
    __metadata("design:paramtypes", [grants_service_1.GrantsService,
        nylas_service_1.NylasService])
], GrantsController);
//# sourceMappingURL=grants.controller.js.map