import { Test, TestingModule } from '@nestjs/testing';
import { InboxGrantsController } from './inbox-grants.controller';
import { InboxGrantsService } from './inbox-grants.service';

describe('InboxGrantsController', () => {
    let controller: InboxGrantsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InboxGrantsController],
            providers: [InboxGrantsService],
        }).compile();

        controller = module.get<InboxGrantsController>(InboxGrantsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
