"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchNodeMetadataDto = exports.UpdateNodeDto = exports.DeactivateNodeDto = exports.ActivateNodeResponse = exports.ActivateNodeDto = exports.SignNodeAgreementDto = void 0;
const tslib_1 = require("tslib");
const chain_api_1 = require("@gala-games/chain-api");
const NodeOperatorAgreement_1 = require("../types/NodeOperatorAgreement");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SignNodeAgreementDto extends chain_api_1.ChainCallDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => chain_api_1.TokenInstanceKey),
    tslib_1.__metadata("design:type", chain_api_1.TokenInstanceKey)
], SignNodeAgreementDto.prototype, "tokenInstanceKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NodeOperatorAgreement_1.NodeOperatorAgreement),
    tslib_1.__metadata("design:type", NodeOperatorAgreement_1.NodeOperatorAgreement)
], SignNodeAgreementDto.prototype, "operatorAgreement", void 0);
exports.SignNodeAgreementDto = SignNodeAgreementDto;
class ActivateNodeDto extends chain_api_1.ChainCallDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => chain_api_1.TokenInstanceKey),
    tslib_1.__metadata("design:type", chain_api_1.TokenInstanceKey)
], ActivateNodeDto.prototype, "tokenInstanceKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NodeOperatorAgreement_1.NodeOperatorAgreement),
    tslib_1.__metadata("design:type", NodeOperatorAgreement_1.NodeOperatorAgreement)
], ActivateNodeDto.prototype, "operatorAgreement", void 0);
exports.ActivateNodeDto = ActivateNodeDto;
class ActivateNodeResponse extends chain_api_1.ChainCallDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => chain_api_1.TokenBalance),
    tslib_1.__metadata("design:type", chain_api_1.TokenBalance)
], ActivateNodeResponse.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NodeOperatorAgreement_1.NodeMetadata),
    tslib_1.__metadata("design:type", NodeOperatorAgreement_1.NodeMetadata)
], ActivateNodeResponse.prototype, "metadata", void 0);
exports.ActivateNodeResponse = ActivateNodeResponse;
class DeactivateNodeDto extends chain_api_1.ChainCallDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => chain_api_1.TokenInstanceKey),
    tslib_1.__metadata("design:type", chain_api_1.TokenInstanceKey)
], DeactivateNodeDto.prototype, "tokenInstanceKey", void 0);
exports.DeactivateNodeDto = DeactivateNodeDto;
class UpdateNodeDto extends chain_api_1.ChainCallDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => chain_api_1.TokenInstanceKey),
    tslib_1.__metadata("design:type", chain_api_1.TokenInstanceKey)
], UpdateNodeDto.prototype, "tokenInstanceKey", void 0);
exports.UpdateNodeDto = UpdateNodeDto;
class FetchNodeMetadataDto extends chain_api_1.ChainCallDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => chain_api_1.TokenInstanceKey),
    tslib_1.__metadata("design:type", chain_api_1.TokenInstanceKey)
], FetchNodeMetadataDto.prototype, "tokenInstanceKey", void 0);
exports.FetchNodeMetadataDto = FetchNodeMetadataDto;
//# sourceMappingURL=nodes.js.map