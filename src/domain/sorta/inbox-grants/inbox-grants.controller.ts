import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
} from '@nestjs/common';
import { InboxGrantsService } from './inbox-grants.service';
import { CreateInboxGrantDto } from './dto/create-inbox-grant.dto';
import { UpdateInboxGrantDto } from './dto/update-inbox-grant.dto';
import { NylasService } from 'src/domain/nylas/nylas.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('grants')
export class InboxGrantsController {
    constructor(
        private readonly inboxGrantsService: InboxGrantsService,
        private readonly nylasService: NylasService,
    ) {}

    @Post()
    async create(
        @Request() req,
        @Body() createInboxGrantDto: CreateInboxGrantDto,
    ) {
        const userId = req.user.id;

        try {
            const tokenExchange = await this.nylasService.exchangeCodeForToken(
                createInboxGrantDto.code,
            );

            return await this.inboxGrantsService.create({
                Owner: {
                    connect: {
                        id: userId,
                    },
                },
                emailProvider: tokenExchange.provider,
                email: tokenExchange.email,
                grantToken: tokenExchange.accessToken,
                refreshToken: tokenExchange.refreshToken,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get()
    async findAll() {
        return this.inboxGrantsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.inboxGrantsService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateInboxGrantDto: UpdateInboxGrantDto,
    ) {
        return this.inboxGrantsService.update(+id, updateInboxGrantDto);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        const userId = req.user.id;
        try {
            const grantDestruction = await this.nylasService.deleteGrant(id);
        } catch (error) {}
        return this.inboxGrantsService.remove(+id);
    }
}
