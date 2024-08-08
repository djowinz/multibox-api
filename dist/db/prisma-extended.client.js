"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientExtended = exports.CustomPrismaClient = void 0;
const client_1 = require("@prisma/client");
const prisma_extensions_1 = require("./prisma.extensions");
const CustomPrismaClient = (prismaClient) => {
    return prismaClient
        .$extends(prisma_extensions_1.FilterSoftDeleted)
        .$extends(prisma_extensions_1.SoftDelete)
        .$extends(prisma_extensions_1.SoftDeleteMany);
};
exports.CustomPrismaClient = CustomPrismaClient;
class PrismaClientExtended extends client_1.PrismaClient {
    get client() {
        if (!this.customPrismaClient) {
            this.customPrismaClient = (0, exports.CustomPrismaClient)(this);
        }
        return this.customPrismaClient;
    }
}
exports.PrismaClientExtended = PrismaClientExtended;
//# sourceMappingURL=prisma-extended.client.js.map