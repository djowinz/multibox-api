import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    // Post,
    Put,
    Query,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { GrantsService } from '../grants/grants.service';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { AuthGuard } from '@nestjs/passport';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BulkUpdateMessageDto } from './dto/bulk-update-message.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly nylasService: NylasService,
        private readonly grantService: GrantsService,
    ) {}

    // @Post(':grantId')
    // async send(
    //     @Request() req,
    //     @Param('grantId') grantId: string,
    //     @Body() message: any,
    // ) {

    // }

    @Get(':grantId/:messageId')
    async findOne(
        @Request() req,
        @Param('grantId') grantId: string,
        @Param('messageId') messageId: string,
    ) {
        const userId = req.user.id;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return await this.nylasService.fetchMessage(
                grant.grantId,
                messageId,
            );
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Message_Retrival_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Get(':grantId/folder/:folderId')
    async findAll(
        @Request() req,
        @Param('grantId') grantId: string,
        @Param('folderId') folderId: string,
        @Query('cursor') cursor: string,
        @Query('filter') filter: string,
    ) {
        const userId = req.user.id;
        const filterDecoded = filter ? decodeURI(filter) : '';

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return await this.nylasService.fetchThreads(
                grant.grantId,
                folderId,
                50,
                cursor ? cursor : '',
                filterDecoded,
            );
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Folder_Retrival_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Put(':grantId/:objectId')
    async update(
        @Request() req,
        @Param('grantId') grantId: string,
        @Param('objectId') objectId: string,
        @Query('objectType') objectType: 'message' | 'thread',
        @Body() updateMessageDto: UpdateMessageDto,
    ) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return await this.nylasService.updateObjectAttributes(
                grant.grantId,
                objectId,
                updateMessageDto,
                isMessageObject,
            );
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Object_Patch_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Delete(':grantId/:objectId')
    async delete(
        @Request() req,
        @Param('grantId') grantId: string,
        @Param('objectId') objectId: string,
        @Query('objectType') objectType: 'message' | 'thread',
    ) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return await this.nylasService.deleteObject(
                grant.grantId,
                objectId,
                isMessageObject,
            );
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Object_Delete_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Put(':grantId/bulk/update')
    async updateBulk(
        @Request() req,
        @Param('grantId') grantId: string,
        @Query('objectType') objectType: 'message' | 'thread',
        @Body() bulkUpdateMessageDto: BulkUpdateMessageDto,
    ) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';
        const { objectIds, update } = bulkUpdateMessageDto;

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return Promise.all(
                objectIds.map((objectId) =>
                    this.nylasService.updateObjectAttributes(
                        grant.grantId,
                        objectId,
                        update,
                        isMessageObject,
                    ),
                ),
            );
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Object_Patch_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Put(':grantId/bulk/delete')
    async deleteBulk(
        @Request() req,
        @Param('grantId') grantId: string,
        @Query('objectType') objectType: 'message' | 'thread',
        @Body() bulkDeleteDto: { objectIds: string[] },
    ) {
        const userId = req.user.id;
        const isMessageObject = objectType === 'message';
        const { objectIds } = bulkDeleteDto;

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            return Promise.all(
                objectIds.map((objectId) =>
                    this.nylasService.deleteObject(
                        grant.grantId,
                        objectId,
                        isMessageObject,
                    ),
                ),
            );
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Object_Delete_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }
}
