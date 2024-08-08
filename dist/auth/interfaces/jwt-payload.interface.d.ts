import { JsonObject } from '../../common/interfaces/json-object.interface';
export interface JwtPayload extends JsonObject {
    email: string;
    iss?: string;
    sub?: string;
    aud?: string[];
    iat?: number;
    exp?: number;
    azp?: string;
    scope?: string;
}
