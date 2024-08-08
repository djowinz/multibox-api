"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantsModule = void 0;
const common_1 = require("@nestjs/common");
const grants_service_1 = require("./grants.service");
const grants_controller_1 = require("./grants.controller");
const prisma_module_1 = require("../../../../db/prisma.module");
const nylas_module_1 = require("../../../nylas/nylas.module");
let GrantsModule = class GrantsModule {
};
exports.GrantsModule = GrantsModule;
exports.GrantsModule = GrantsModule = __decorate([
    (0, common_1.Module)({
        controllers: [grants_controller_1.GrantsController],
        providers: [grants_service_1.GrantsService],
        imports: [prisma_module_1.PrismaModule, nylas_module_1.NylasModule],
        exports: [grants_service_1.GrantsService],
    })
], GrantsModule);
//# sourceMappingURL=grants.module.js.map