import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    updateUser(req: any, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(req: any): Promise<User>;
}
