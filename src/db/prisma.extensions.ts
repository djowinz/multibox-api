import { Prisma } from '@prisma/client';

export const SoftDelete = Prisma.defineExtension({
    name: 'SoftDelete',
    model: {
        $allModels: {
            async delete<M, A>(
                this: M,
                where: Prisma.Args<M, 'delete'>['where'],
            ): Promise<Prisma.Result<M, A, 'update'>> {
                const context = Prisma.getExtensionContext(this);

                return (context as any).update({
                    where,
                    data: {
                        deletedAt: new Date().toISOString(),
                    },
                });
            },
        },
    },
});

//extension for soft delete Many
export const SoftDeleteMany = Prisma.defineExtension({
    name: 'softDeleteMany',
    model: {
        $allModels: {
            async deleteMany<M, A>(
                this: M,
                where: Prisma.Args<M, 'deleteMany'>['where'],
            ): Promise<Prisma.Result<M, A, 'updateMany'>> {
                const context = Prisma.getExtensionContext(this);

                return (context as any).updateMany({
                    where,
                    data: {
                        deletedAt: new Date().toISOString(),
                    },
                });
            },
        },
    },
});

//extension for filtering soft deleted rows from queries
export const FilterSoftDeleted = Prisma.defineExtension({
    name: 'filterSoftDeleted',
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }) {
                if (
                    operation === 'findUnique' ||
                    operation === 'findFirst' ||
                    operation === 'findMany'
                ) {
                    args.where = { ...args.where, deletedAt: null };
                    return query(args);
                }
                return query(args);
            },
        },
    },
});
