import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    UseGuards,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { GrantsService } from './grants.service';
import { CreateGrantDto } from './dto/create-grant.dto';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { AuthGuard } from '@nestjs/passport';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';

@UseGuards(AuthGuard('jwt'))
@Controller('grants')
export class GrantsController {
    private readonly logger = new Logger(GrantsController.name);
    constructor(
        private readonly inboxGrantsService: GrantsService,
        private readonly nylasService: NylasService,
    ) {}

    @Post()
    async create(@Request() req, @Body() createInboxGrantDto: CreateGrantDto) {
        const userId = req.user.id;

        try {
            const tokenExchange = await this.nylasService.exchangeCodeForToken(
                createInboxGrantDto.claimToken,
                createInboxGrantDto.redirectUri,
            );

            return await this.inboxGrantsService.create({
                Owner: {
                    connect: {
                        id: userId,
                    },
                },
                emailProvider: tokenExchange.provider,
                email: tokenExchange.email,
                grantId: tokenExchange.grantId,
                refreshToken: '',
                deletedAt: null,
            });
        } catch (error) {
            this.logger.error(error);
            if (
                Object(error).hasOwnProperty('code') &&
                error.code === ServiceErrorCode.Nylas_Token_Exchange_Error
            ) {
                throw new BadRequestException(error.message);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    @Get()
    async findAll(@Request() req) {
        const userId = req.user.id;
        return await this.inboxGrantsService.findAll(userId);
    }

    // @Get(':id')
    // async findOne(@Param('id') id: string) {
    //     return this.inboxGrantsService.findOne(+id);
    // }

    // @Patch(':id')
    // async update(
    //     @Param('id') id: string,
    //     @Body() updateInboxGrantDto: UpdateInboxGrantDto,
    // ) {
    //     return this.inboxGrantsService.update(+id, updateInboxGrantDto);
    // }

    // @Delete(':id')
    // async remove(@Request() req, @Param('id') id: string) {
    //     const userId = req.user.id;
    //     try {
    //         const grantDestruction = await this.nylasService.deleteGrant(id);
    //     } catch (error) {}
    //     return this.inboxGrantsService.remove(+id);
    // }
}
