import { IsHexColor, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsHexColor()
    readonly textColor: string;

    @IsOptional()
    @IsHexColor()
    readonly backgroundColor: string;
}
