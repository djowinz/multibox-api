import { NylasService } from 'src/domain/nylas/nylas.service';
import { GrantsService } from '../grants/grants.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BulkUpdateMessageDto } from './dto/bulk-update-message.dto';
export declare class MessagesController {
    private readonly nylasService;
    private readonly grantService;
    constructor(nylasService: NylasService, grantService: GrantsService);
    findOne(req: any, grantId: string, messageId: string): Promise<import("nylas").NylasResponse<import("nylas").Message>>;
    findAll(req: any, grantId: string, folderId: string, cursor: string, filter: string): Promise<import("nylas").NylasListResponse<import("nylas").Thread> & {
        next: () => Promise<IteratorResult<import("nylas").NylasListResponse<import("nylas").Thread>, undefined>>;
    }>;
    update(req: any, grantId: string, objectId: string, objectType: 'message' | 'thread', updateMessageDto: UpdateMessageDto): Promise<any>;
    delete(req: any, grantId: string, objectId: string, objectType: 'message' | 'thread'): Promise<any>;
    updateBulk(req: any, grantId: string, objectType: 'message' | 'thread', bulkUpdateMessageDto: BulkUpdateMessageDto): Promise<any[]>;
    deleteBulk(req: any, grantId: string, objectType: 'message' | 'thread', bulkDeleteDto: {
        objectIds: string[];
    }): Promise<any[]>;
}
