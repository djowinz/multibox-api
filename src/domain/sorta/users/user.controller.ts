import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Patch,
    Request,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ServiceError } from 'src/common/utils/custom.error';
import { ServiceErrorCode } from 'src/common/utils/enums/service-error-codes';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch()
    async updateUser(
        @Request() req,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        try {
            return await this.userService.updateUser(
                req.user.id,
                updateUserDto,
            );
        } catch (error) {
            if (
                (error as ServiceError).code === ServiceErrorCode.Prisma_P2002
            ) {
                console.error(error);
                throw new ConflictException(error);
            }
            throw new BadRequestException(error.message);
        }
    }

    @Delete()
    async deleteUser(@Request() req): Promise<User> {
        try {
            return await this.userService.deleteUser(req.user.id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
