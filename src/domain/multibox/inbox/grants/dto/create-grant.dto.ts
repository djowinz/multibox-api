import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGrantDto {
    @IsNotEmpty()
    @IsString()
    readonly claimToken: string;

    @IsNotEmpty()
    @IsString()
    readonly emailProvider: string;

    @IsNotEmpty()
    @IsString()
    readonly redirectUri: string;
}
