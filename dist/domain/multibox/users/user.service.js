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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../db/prisma.service");
const custom_error_1 = require("../../../common/utils/custom.error");
const service_error_codes_1 = require("../../../common/utils/enums/service-error-codes");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserByEmail(email) {
        try {
            return await this.prisma.client.user.findUnique({
                where: {
                    email,
                },
            });
        }
        catch (error) {
            const prismaError = error;
            if (prismaError.code === service_error_codes_1.ServiceErrorCode.Prisma_P2018) {
                throw new custom_error_1.ServiceError(`Email: ${email} not found`, service_error_codes_1.ServiceErrorCode.Prisma_P2018);
            }
            throw new custom_error_1.ServiceError('Failed to fetch user by email', service_error_codes_1.ServiceErrorCode.Unknown);
        }
    }
    async updateUser(id, data) {
        try {
            return await this.prisma.client.user.update({
                data,
                where: {
                    id: id,
                },
            });
        }
        catch (error) {
            throw new custom_error_1.ServiceError('Failed to update user', service_error_codes_1.ServiceErrorCode.Unknown);
        }
    }
    async upsertViaAuth(data) {
        try {
            return await this.prisma.client.user.upsert({
                where: {
                    email: data.email,
                },
                update: {
                    lastLogin: new Date().toISOString(),
                },
                create: data,
            });
        }
        catch (error) {
            throw new custom_error_1.ServiceError('Failed to create user', service_error_codes_1.ServiceErrorCode.Unknown);
        }
    }
    async deleteUser(id) {
        try {
            return await this.prisma.client.user.delete({
                id,
            });
        }
        catch (error) {
            throw new custom_error_1.ServiceError('Failed to delete user', service_error_codes_1.ServiceErrorCode.Unknown);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map