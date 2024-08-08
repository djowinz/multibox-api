"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGrantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_grant_dto_1 = require("./create-grant.dto");
class UpdateGrantDto extends (0, swagger_1.PartialType)(create_grant_dto_1.CreateGrantDto) {
}
exports.UpdateGrantDto = UpdateGrantDto;
//# sourceMappingURL=update-grant.dto.js.map