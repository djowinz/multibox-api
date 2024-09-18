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
    Patch,
    Delete,
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
                console.log('no grant!');
                throw new UnauthorizedException('Invalid grantId provided');
            }

            // create label with provider first
            const providerFolder = await this.nylasService.createFolder(
                grant.grantId,
                createFolderDto,
            );

            // persist label in db
            const serverRecord = await this.foldersService.create({
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

            return {
                provider: providerFolder.data,
                server: serverRecord,
            }
        } catch (error) {
            console.log(error);
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
            if (error.code === ServiceErrorCode.Nylas_Folder_Create_Error) {
                throw new BadRequestException(error.message);
            }
        }
    }

    // folderId is the id from the provider not our db
    @Post(':grantId/:providerFolderId/display')
    async addToInboxView(@Request() req, @Param('grantId') grantId: string, @Param('providerFolderId') folderId: string) {
        const userId = req.user.id;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }

            // check if folder exists in provider - first
            const providerFolder = await this.nylasService.fetchFolder(grant.grantId, folderId);

            // create folder in db
            return await this.foldersService.create({
                name: providerFolder.data.name,
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

        }
    }

    @Patch(':grantId/:folderId')
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
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }
            return await this.foldersService.findAll(userId, grantId);
        } catch (error) {
            if (error.code === ServiceErrorCode.Prisma_Unknown) {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    // folderId is the id from the provider not our db
    @Delete(':grantId/:providerFolderId')
    async deleteFolder(@Request() req, @Param('grantId') grantId: string, @Param('providerFolderId') folderId: string) {
        const userId = req.user.id;
        try {
            const grant = await this.grantService.findOne(userId, grantId);
            if (!grant) {
                throw new UnauthorizedException('Invalid grantId provided');
            }
            await this.nylasService.deleteFolder(grant.grantId, folderId);
            return await this.foldersService.remove(userId, folderId);
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
