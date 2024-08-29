import { IsArray, IsHexColor, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsArray()
    readonly attributes: string[];

    @IsString()
    @IsOptional()
    readonly parentId: string;

    @IsOptional()
    @IsHexColor()
    readonly textColor: string;

    @IsOptional()
    @IsHexColor()
    readonly backgroundColor: string;
}
