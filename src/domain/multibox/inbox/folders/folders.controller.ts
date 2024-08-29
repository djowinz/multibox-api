import {
    Controller,
    Get,
    Param,
    UseGuards,
    Request,
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { AuthGuard } from '@nestjs/passport';
import { GrantsService } from '../grants/grants.service';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { Folder as FolderEntity } from './entities/folder.entity';
import { Folder } from 'nylas';
import { FoldersService } from './folders.service';


@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
    folderService: any;
    constructor(
        private readonly nylasService: NylasService,
        private readonly grantService: GrantsService,
        private readonly foldersService: FoldersService,
    ) {}

    // @Post()
    // create(@Body() createFolderDto: CreateFolderDto) {
    //   return this.foldersService.create(createFolderDto);
    // }

    @Get(':grantId')
    async findAll(@Request() req, @Param('grantId') grantId: string): Promise<FolderEntity[]> {
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

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.foldersService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    //   return this.foldersService.update(+id, updateFolderDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.foldersService.remove(+id);
    // }
}
