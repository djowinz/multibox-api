import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMessageDto {
    @IsBoolean()
    @IsOptional()
    readonly starred: boolean;

    @IsBoolean()
    @IsOptional()
    readonly unread: boolean;

    @IsArray()
    @IsOptional()
    readonly folders: string[];
}
