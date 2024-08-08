import { Test, TestingModule } from '@nestjs/testing';
import { GrantsController } from './grants.controller';
import { GrantsService } from './grants.service';

describe('InboxGrantsController', () => {
    let controller: GrantsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GrantsController],
            providers: [GrantsService],
        }).compile();

        controller = module.get<GrantsController>(GrantsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
