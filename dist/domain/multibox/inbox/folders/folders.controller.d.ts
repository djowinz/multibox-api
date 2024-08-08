import { NylasService } from 'src/domain/nylas/nylas.service';
import { GrantsService } from '../grants/grants.service';
export declare class FoldersController {
    private readonly nylasService;
    private readonly grantService;
    constructor(nylasService: NylasService, grantService: GrantsService);
    findAll(req: any, grantId: string): Promise<{
        id: string;
        name: string;
        attributes: string[];
        totalCount: number;
        unreadCount: number;
        systemFolder: boolean;
    }[]>;
}
