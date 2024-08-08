"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSoftDeleted = exports.SoftDeleteMany = exports.SoftDelete = void 0;
const client_1 = require("@prisma/client");
exports.SoftDelete = client_1.Prisma.defineExtension({
    name: 'SoftDelete',
    model: {
        $allModels: {
            async delete(where) {
                const context = client_1.Prisma.getExtensionContext(this);
                return context.update({
                    where,
                    data: {
                        deletedAt: new Date().toISOString(),
                    },
                });
            },
        },
    },
});
exports.SoftDeleteMany = client_1.Prisma.defineExtension({
    name: 'softDeleteMany',
    model: {
        $allModels: {
            async deleteMany(where) {
                const context = client_1.Prisma.getExtensionContext(this);
                return context.updateMany({
                    where,
                    data: {
                        deletedAt: new Date().toISOString(),
                    },
                });
            },
        },
    },
});
exports.FilterSoftDeleted = client_1.Prisma.defineExtension({
    name: 'filterSoftDeleted',
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }) {
                if (operation === 'findUnique' ||
                    operation === 'findFirst' ||
                    operation === 'findMany') {
                    args.where = { ...args.where, deletedAt: null };
                    return query(args);
                }
                return query(args);
            },
        },
    },
});
//# sourceMappingURL=prisma.extensions.js.map