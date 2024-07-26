import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { GrantsService } from '../grants/grants.service';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { Thread } from 'nylas';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly nylasService: NylasService,
        private readonly grantService: GrantsService,
    ) {}

    @Get(':grantId/:folderId')
    async findAll(
        @Request() req,
        @Param('grantId') grantId: string,
        @Param('folderId') folderId: string,
    ) {
        const userId = req.user.id;

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return await this.nylasService.fetchThreads(grant.grantId, '', 50, [
                folderId,
            ]);
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Folder_Retrival_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }
}
