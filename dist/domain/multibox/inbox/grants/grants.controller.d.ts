import { GrantsService } from './grants.service';
import { CreateGrantDto } from './dto/create-grant.dto';
import { NylasService } from 'src/domain/nylas/nylas.service';
export declare class GrantsController {
    private readonly inboxGrantsService;
    private readonly nylasService;
    constructor(inboxGrantsService: GrantsService, nylasService: NylasService);
    create(req: any, createInboxGrantDto: CreateGrantDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }>;
    findAll(req: any): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ownerId: string;
        grantId: string;
        refreshToken: string;
        emailProvider: string;
    }[]>;
}
