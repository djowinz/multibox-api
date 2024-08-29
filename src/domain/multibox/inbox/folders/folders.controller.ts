import {
    Controller,
    Get,
    Param,
    UseGuards,
    Request,
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
    Post,
    Body,
} from '@nestjs/common';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { AuthGuard } from '@nestjs/passport';
import { GrantsService } from '../grants/grants.service';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { Folder as FolderEntity } from './entities/folder.entity';
import { Folder } from 'nylas';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
    folderService: any;
    constructor(
        private readonly nylasService: NylasService,
        private readonly grantService: GrantsService,
        private readonly foldersService: FoldersService,
    ) {}

    @Post(':grantId')
    async create(
        @Request() req,
        @Param('grantId') grantId: string,
        @Body() createFolderDto: CreateFolderDto,
    ) {
        const userId = req.user.id;

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            // create label with provider first
            const providerFolder = await this.nylasService.createFolder(
                grant.grantId,
                createFolderDto,
            );

            // persist label in db
            return this.foldersService.create({
                name: createFolderDto.name,
                folderId: providerFolder.data.id,
                backgroundColor: providerFolder.data.backgroundColor,
                textColor: providerFolder.data.textColor,
                InboxGrant: {
                    connect: {
                        id: grant.id,
                    },
                },
                Owner: {
                    connect: {
                        id: userId,
                    },
                },
            });
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Folder_Retrival_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Post(':grantId/:folderId')
    async update(
        @Request() req,
        @Param('grantId') grantId: string,
        @Param('folderId') folderId: string,
        @Body() createFolderDto: CreateFolderDto,
    ) {
        const userId = req.user.id;

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            // update label with provider first
            const providerFolder = await this.nylasService.updateFolder(
                grant.grantId,
                folderId,
                createFolderDto,
            );

            // persist label in db
            return this.foldersService.update(userId, folderId, {
                name: createFolderDto.name,
                backgroundColor: providerFolder.data.backgroundColor,
                textColor: providerFolder.data.textColor,
            });
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Folder_Retrival_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Get(':grantId')
    async findAll(
        @Request() req,
        @Param('grantId') grantId: string,
    ): Promise<FolderEntity[]> {
        const userId = req.user.id;

        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }
            const { data } = await this.nylasService.fetchFolders(
                grant.grantId,
            );
            if (!data) {
                return [];
            }
            return data.map((folder: Folder) => {
                return {
                    id: folder.id,
                    name: folder.name,
                    attributes: folder.attributes,
                    totalCount: folder.totalCount,
                    unreadCount: folder.unreadCount,
                    systemFolder: folder.systemFolder,
                    childCount: folder.childCount,
                    parentId: folder.parentId,
                    backgroundColor: folder.backgroundColor,
                    textColor: folder.textColor,
                };
            });
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Folder_Retrival_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    @Get(':grantId/displayed')
    async findDisplayed(@Request() req, @Param('grantId') grantId: string) {
        const userId = req.user.id;
        return await this.foldersService.findAll(userId, grantId);
    }
}
