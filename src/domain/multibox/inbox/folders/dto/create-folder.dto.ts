import { IsHexColor, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ValidateIf((o) => Boolean(o.backgroundColor))
    @IsHexColor()
    @IsOptional()
    readonly textColor: string;

    @ValidateIf((o) => Boolean(o.textColor))
    @IsHexColor()
    @IsOptional()
    readonly backgroundColor: string;
}
