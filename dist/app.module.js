"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = require("./config/app.config");
const auth_module_1 = require("./auth/auth.module");
const nylas_module_1 = require("./domain/nylas/nylas.module");
const users_module_1 = require("./domain/multibox/users/users.module");
const grants_module_1 = require("./domain/multibox/inbox/grants/grants.module");
const folders_module_1 = require("./domain/multibox/inbox/folders/folders.module");
const messages_module_1 = require("./domain/multibox/inbox/messages/messages.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [app_config_1.default],
            }),
            nylas_module_1.NylasModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            grants_module_1.GrantsModule,
            folders_module_1.FoldersModule,
            messages_module_1.MessagesModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map