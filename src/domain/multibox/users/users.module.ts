import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [PrismaModule],
    exports: [UserService],
})
export class UsersModule {}
