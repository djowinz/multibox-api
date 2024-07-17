import { Test, TestingModule } from '@nestjs/testing';
import { InboxGrantsService } from './inbox-grants.service';

describe('InboxGrantsService', () => {
    let service: InboxGrantsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InboxGrantsService],
        }).compile();

        service = module.get<InboxGrantsService>(InboxGrantsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
