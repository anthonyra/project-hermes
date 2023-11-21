"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMetadata = exports.NodeOperatorMetadata = void 0;
const tslib_1 = require("tslib");
const chain_api_1 = require("@gala-games/chain-api");
const bignumber_js_1 = require("bignumber.js");
const chain_api_2 = require("@gala-games/chain-api");
const class_validator_1 = require("class-validator");
class NodeOperatorMetadata extends chain_api_1.ChainObjectBase {
    getMetadata() {
        return {
            nodePublicKey: this.nodePublicKey,
            operatorAgreement: this.operatorAgreement
        };
    }
    deactivate() {
        this.nodePublicKey = undefined;
        this.operatorAgreement = undefined;
        return this;
    }
    ;
    update(nodePublicKey, operatorAgreement) {
        if (nodePublicKey)
            this.nodePublicKey = nodePublicKey;
        if (operatorAgreement)
            this.operatorAgreement = operatorAgreement;
        return this;
    }
    ;
}
NodeOperatorMetadata.INDEX_KEY = "GCNOM";
tslib_1.__decorate([
    (0, chain_api_2.ChainKey)({ position: 0 }),
    tslib_1.__metadata("design:type", String)
], NodeOperatorMetadata.prototype, "collection", void 0);
tslib_1.__decorate([
    (0, chain_api_2.ChainKey)({ position: 1 }),
    tslib_1.__metadata("design:type", String)
], NodeOperatorMetadata.prototype, "category", void 0);
tslib_1.__decorate([
    (0, chain_api_2.ChainKey)({ position: 2 }),
    tslib_1.__metadata("design:type", String)
], NodeOperatorMetadata.prototype, "type", void 0);
tslib_1.__decorate([
    (0, chain_api_2.ChainKey)({ position: 3 }),
    tslib_1.__metadata("design:type", String)
], NodeOperatorMetadata.prototype, "additionalKey", void 0);
tslib_1.__decorate([
    (0, chain_api_2.ChainKey)({ position: 4 }),
    tslib_1.__metadata("design:type", bignumber_js_1.BigNumber)
], NodeOperatorMetadata.prototype, "instance", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], NodeOperatorMetadata.prototype, "nodePublicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", Object)
], NodeOperatorMetadata.prototype, "operatorAgreement", void 0);
exports.NodeOperatorMetadata = NodeOperatorMetadata;
class NodeMetadata {
}
exports.NodeMetadata = NodeMetadata;
