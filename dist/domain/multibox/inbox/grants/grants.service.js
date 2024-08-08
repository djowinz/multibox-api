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
var GrantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../db/prisma.service");
const custom_error_1 = require("../../../../common/utils/custom.error");
const service_error_codes_1 = require("../../../../common/utils/enums/service-error-codes");
let GrantsService = GrantsService_1 = class GrantsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(GrantsService_1.name);
    }
    async create(data) {
        try {
            return await this.prisma.client.inboxGrant.create({ data });
        }
        catch (error) {
            this.logger.error(error);
            throw new custom_error_1.ServiceError('Failed to create inboxGrant', service_error_codes_1.ServiceErrorCode.Prisma_Unknown);
        }
    }
    async findAll(userId) {
        try {
            const grants = await this.prisma.client.inboxGrant.findMany({
                where: {
                    ownerId: userId,
                },
            });
            return grants;
        }
        catch (error) {
            this.logger.error(error);
            throw new custom_error_1.ServiceError('Failed to fetch inboxGrants', service_error_codes_1.ServiceErrorCode.Prisma_Unknown);
        }
    }
    async findOne(userId, id) {
        try {
            return await this.prisma.client.inboxGrant.findUnique({
                where: {
                    ownerId: userId,
                    id,
                },
            });
        }
        catch (error) {
            const prismaError = error;
            if (prismaError.code === service_error_codes_1.ServiceErrorCode.Prisma_P2018) {
                this.logger.debug(`InboxGrant: ${id} not found`);
                throw new custom_error_1.ServiceError(`InboxGrant: ${id} not found`, service_error_codes_1.ServiceErrorCode.Prisma_P2018);
            }
            this.logger.error(error);
            throw new custom_error_1.ServiceError('Failed to fetch inboxGrant', service_error_codes_1.ServiceErrorCode.Prisma_Unknown);
        }
    }
    async update(userId, id, data) {
        try {
            return await this.prisma.client.inboxGrant.update({
                data,
                where: {
                    ownerId: userId,
                    id,
                },
            });
        }
        catch (error) {
            const prismaError = error;
            if (prismaError.code === service_error_codes_1.ServiceErrorCode.Prisma_P2018) {
                this.logger.debug(`InboxGrant: ${id} not found`);
                throw new custom_error_1.ServiceError(`InboxGrant: ${id} not found`, service_error_codes_1.ServiceErrorCode.Prisma_P2018);
            }
            this.logger.error(error);
            throw new custom_error_1.ServiceError('Failed to update inboxGrant', service_error_codes_1.ServiceErrorCode.Prisma_Unknown);
        }
    }
    async remove(ownerId, id) {
        try {
            return await this.prisma.client.inboxGrant.delete({
                ownerId,
                id,
            });
        }
        catch (error) {
            const prismaError = error;
            if (prismaError.code === service_error_codes_1.ServiceErrorCode.Prisma_P2018) {
                this.logger.debug(`InboxGrant: ${id} not found`);
                throw new custom_error_1.ServiceError(`InboxGrant: ${id} not found`, service_error_codes_1.ServiceErrorCode.Prisma_P2018);
            }
            this.logger.error(error);
            throw new custom_error_1.ServiceError('Failed to delete inboxGrant', service_error_codes_1.ServiceErrorCode.Prisma_Unknown);
        }
    }
};
exports.GrantsService = GrantsService;
exports.GrantsService = GrantsService = GrantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GrantsService);
//# sourceMappingURL=grants.service.js.map