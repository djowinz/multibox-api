"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFolderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_folder_dto_1 = require("./create-folder.dto");
class UpdateFolderDto extends (0, swagger_1.PartialType)(create_folder_dto_1.CreateFolderDto) {
}
exports.UpdateFolderDto = UpdateFolderDto;
//# sourceMappingURL=update-folder.dto.js.map