import {
    Body,
    Controller,
    Headers,
    InternalServerErrorException,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SortaApiHeaders } from 'src/common/utils/enums/headers';
import { UserService } from 'src/domain/sorta/users/user.service';
import { CallbackDto } from './dto/callback.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    @Post('callback')
    async callback(
        @Headers() headers: Record<string, string>,
        @Body() callbackDto: CallbackDto,
    ) {
        const authKey = this.configService.get<string>('auth.authorizationKey');

        if (
            Object.keys(headers).find(
                (key) => key === SortaApiHeaders.SORTA_AUTH_KEY,
            )
        ) {
            if (headers[SortaApiHeaders.SORTA_AUTH_KEY] !== authKey) {
                throw new UnauthorizedException(
                    'Unauthorized to access this resource',
                );
            }
        } else {
            throw new UnauthorizedException(
                'Unauthorized to access this resource',
            );
        }
        try {
            return await this.userService.upsertViaAuth({
                ...callbackDto,
                lastLogin: new Date().toISOString(),
                deletedAt: null,
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
