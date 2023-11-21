"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchNodeMetadataDto = exports.UpdateNodeDto = exports.DeactivateNodeDto = exports.ActivateNodeResponse = exports.ActivateNodeDto = exports.SignNodeAgreementDto = void 0;
const chain_api_1 = require("@gala-games/chain-api");
class SignNodeAgreementDto extends chain_api_1.ChainCallDTO {
}
exports.SignNodeAgreementDto = SignNodeAgreementDto;
class ActivateNodeDto extends chain_api_1.ChainCallDTO {
}
exports.ActivateNodeDto = ActivateNodeDto;
class ActivateNodeResponse extends chain_api_1.ChainCallDTO {
}
exports.ActivateNodeResponse = ActivateNodeResponse;
class DeactivateNodeDto extends chain_api_1.ChainCallDTO {
}
exports.DeactivateNodeDto = DeactivateNodeDto;
class UpdateNodeDto extends chain_api_1.ChainCallDTO {
}
exports.UpdateNodeDto = UpdateNodeDto;
class FetchNodeMetadataDto extends chain_api_1.ChainCallDTO {
}
exports.FetchNodeMetadataDto = FetchNodeMetadataDto;
