import { ConfigService } from '@nestjs/config';
export declare class NylasService {
    private ny;
    private configService;
    constructor(configService: ConfigService);
    exchangeCodeForToken(code: string, redirectUri: string): Promise<import("nylas").CodeExchangeResponse>;
    deleteGrant(grantId: string): Promise<import("nylas").NylasBaseResponse>;
    fetchFolders(grantId: string): Promise<import("nylas").NylasListResponse<import("nylas").Folder> & {
        next: () => Promise<IteratorResult<import("nylas").NylasListResponse<import("nylas").Folder>, undefined>>;
    }>;
    updateObjectAttributes(grantId: string, objectId: string, update: any, isMessage: boolean): Promise<any>;
    deleteObject(grantId: string, objectId: string, isMessage: boolean): Promise<any>;
    fetchMessage(grantId: string, messagesId: string): Promise<import("nylas").NylasResponse<import("nylas").Message>>;
    fetchThreads(grantId: string, folderId: string, limit: number, pageCursor?: string, filter?: string): Promise<import("nylas").NylasListResponse<import("nylas").Thread> & {
        next: () => Promise<IteratorResult<import("nylas").NylasListResponse<import("nylas").Thread>, undefined>>;
    }>;
}
