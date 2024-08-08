import { IsArray, IsOptional } from 'class-validator';
import { UpdateMessageDto } from './update-message.dto';

export class BulkUpdateMessageDto {
    @IsArray()
    @IsOptional()
    readonly objectIds: string[];

    @IsOptional()
    readonly update: UpdateMessageDto;
}
