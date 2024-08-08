import { PrismaClient } from '@prisma/client';
export declare const CustomPrismaClient: (prismaClient: PrismaClient) => import("@prisma/client/runtime/library").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {
        $allModels: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        user: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        inboxGrant: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        inboxLabel: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        group: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
    };
    query: {};
    client: {};
}, import(".prisma/client").Prisma.PrismaClientOptions>, import(".prisma/client").Prisma.TypeMapCb, {
    result: {};
    model: {
        $allModels: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        user: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        inboxGrant: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        inboxLabel: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
        group: {
            delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
            deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
        };
    };
    query: {};
    client: {};
}, {}>;
export declare class PrismaClientExtended extends PrismaClient {
    customPrismaClient: CustomPrismaClient;
    get client(): import("@prisma/client/runtime/library").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
        result: {};
        model: {
            $allModels: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            user: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            inboxGrant: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            inboxLabel: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            group: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
        };
        query: {};
        client: {};
    }, import(".prisma/client").Prisma.PrismaClientOptions>, import(".prisma/client").Prisma.TypeMapCb, {
        result: {};
        model: {
            $allModels: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            user: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            inboxGrant: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            inboxLabel: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
            group: {
                delete: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "delete">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "update">>;
                deleteMany: () => <M, A>(this: M, where: import("@prisma/client/runtime/library").Args<M, "deleteMany">["where"]) => Promise<import("@prisma/client/runtime/library").Result<M, A, "updateMany">>;
            };
        };
        query: {};
        client: {};
    }, {}>;
}
export type CustomPrismaClient = ReturnType<typeof CustomPrismaClient>;
