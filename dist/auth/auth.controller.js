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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const headers_1 = require("../common/utils/enums/headers");
const user_service_1 = require("../domain/multibox/users/user.service");
const callback_dto_1 = require("./dto/callback.dto");
let AuthController = AuthController_1 = class AuthController {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async callback(headers, callbackDto) {
        const authKey = this.configService.get('auth.authorizationKey');
        if (Object.keys(headers).find((key) => key === headers_1.SortaApiHeaders.SORTA_AUTH_KEY)) {
            if (headers[headers_1.SortaApiHeaders.SORTA_AUTH_KEY] !== authKey) {
                this.logger.error('Invalid auth key in header');
                throw new common_1.UnauthorizedException('Unauthorized to access this resource');
            }
        }
        else {
            this.logger.error('Missing auth header');
            throw new common_1.UnauthorizedException('Unauthorized to access this resource');
        }
        try {
            return await this.userService.upsertViaAuth({
                ...callbackDto,
                lastLogin: new Date().toISOString(),
                deletedAt: null,
            });
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('callback'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, callback_dto_1.CallbackDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map