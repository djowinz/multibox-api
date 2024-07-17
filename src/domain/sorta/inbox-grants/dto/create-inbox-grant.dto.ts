import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInboxGrantDto {
    @IsNotEmpty()
    @IsString()
    readonly code: string;
}
