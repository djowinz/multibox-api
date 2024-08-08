"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwks_rsa_1 = require("jwks-rsa");
const user_service_1 = require("../domain/multibox/users/user.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, userService) {
        super({
            secretOrKeyProvider: (0, jwks_rsa_1.passportJwtSecret)({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${configService.get('auth.domain')}/.well-known/jwks.json`,
            }),
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: configService.get('auth.audience'),
            issuer: `https://${configService.get('auth.domain')}/`,
            algorithms: ['RS256'],
        });
        this.userService = userService;
    }
    async validate(payload) {
        const minimumScope = ['openid', 'profile', 'email'];
        if (payload?.scope
            ?.split(' ')
            .filter((scope) => minimumScope.indexOf(scope) > -1).length !==
            3) {
            throw new common_1.UnauthorizedException('JWT does not possess the required scope (`openid profile email`).');
        }
        try {
            const user = await this.userService.getUserByEmail(payload.email);
            return user;
        }
        catch (error) {
            console.error(error);
            throw new common_1.UnauthorizedException('User not found');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, user_service_1.UserService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map