import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { AuthGuard } from '@nestjs/passport';
import { GrantsService } from '../grants/grants.service';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { Folder } from 'nylas';

@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
  constructor(private readonly nylasService: NylasService, private readonly grantService: GrantsService) {}

  // @Post()
  // create(@Body() createFolderDto: CreateFolderDto) {
  //   return this.foldersService.create(createFolderDto);
  // }

  @Get(':grantId')
  async findAll(@Request() req, @Param('grantId') grantId: string) {
    const userId = req.user.id;

    try {
      const grant = await this.grantService.findOne(userId, grantId);
      if (!grant) {
        throw new UnauthorizedException('Invalid grantId provided');
      }
      const { data } = await this.nylasService.fetchFolders(grant.grantId);
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
