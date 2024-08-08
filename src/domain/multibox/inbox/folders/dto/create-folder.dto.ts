import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsArray()
    readonly attributes: string[];
}
