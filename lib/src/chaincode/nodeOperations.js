"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNodeMetadata = exports.updateNode = exports.deactivateNode = exports.activateNode = exports.signNodeAgreement = void 0;
const chaincode_1 = require("@gala-games/chaincode");
const chain_api_1 = require("@gala-games/chain-api");
const NodeOperatorAgreement_1 = require("../types/NodeOperatorAgreement");
const nodes_1 = require("../dtos/nodes");
const bignumber_js_1 = require("bignumber.js");
const class_transformer_1 = require("class-transformer");
async function signNodeAgreement({ tokenInstanceKey, nodePublicKey, operatorAgreement }) {
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey;
    const nodeOperatorMetadata = (0, class_transformer_1.plainToInstance)(NodeOperatorAgreement_1.NodeOperatorMetadata, {
        collection,
        category,
        type,
        additionalKey,
        instance,
        nodePublicKey,
        operatorAgreement
    });
    nodeOperatorMetadata.validateOrReject();
    return nodeOperatorMetadata;
}
exports.signNodeAgreement = signNodeAgreement;
async function activateNode(ctx, { owner, lockAuthority, tokenInstanceKey, expires, nodePublicKey, operatorAgreement, operatorSignature }) {
    var _a;
    if (owner !== ctx.callingUser) {
        throw new chain_api_1.UnauthorizedError("need to be the owner!");
    }
    if (operatorAgreement && (operatorSignature !== null && operatorSignature !== void 0 ? operatorSignature : "").length == 0) {
        throw new chain_api_1.UnauthorizedError("missing operator signature!");
    }
    if (operatorAgreement && operatorSignature) {
        const operatorDto = chain_api_1.ChainCallDTO.deserialize(nodes_1.SignNodeAgreementDto, operatorSignature);
        await (0, chaincode_1.ensureIsAuthorizedBy)(ctx, operatorDto, (_a = operatorAgreement === null || operatorAgreement === void 0 ? void 0 : operatorAgreement.publicKey) !== null && _a !== void 0 ? _a : "");
        const { tokenInstanceKey: operatorTIK, nodePublicKey: operatorNPK, operatorAgreement: operatorOA } = operatorDto;
        if (JSON.stringify(tokenInstanceKey) !== JSON.stringify(operatorTIK)) {
            throw new chain_api_1.UnauthorizedError("token mismatch!");
        }
        if (nodePublicKey !== operatorNPK) {
            throw new chain_api_1.UnauthorizedError("node key mismatch!");
        }
        if (JSON.stringify(operatorAgreement) !== JSON.stringify(operatorOA)) {
            throw new chain_api_1.UnauthorizedError("operator agreement mismatch!");
        }
    }
    const balance = await (0, chaincode_1.lockToken)(ctx, {
        owner,
        lockAuthority,
        tokenInstanceKey,
        quantity: new bignumber_js_1.BigNumber(1),
        allowancesToUse: [],
        name: undefined,
        expires: expires !== null && expires !== void 0 ? expires : 0,
        verifyAuthorizedBridgeUser: async (c) => undefined
    });
    const nodeOperatorMetadata = await signNodeAgreement({
        tokenInstanceKey,
        nodePublicKey,
        operatorAgreement,
    });
    await (0, chaincode_1.putChainObject)(ctx, nodeOperatorMetadata);
    const metadata = nodeOperatorMetadata.getMetadata();
    return (0, class_transformer_1.plainToInstance)(nodes_1.ActivateNodeResponse, { balance, metadata });
}
exports.activateNode = activateNode;
;
async function deactivateNode(ctx, { owner, tokenInstanceKey, }) {
    if (owner !== ctx.callingUser) {
        throw new chain_api_1.UnauthorizedError("need to be the owner!");
    }
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey;
    const key = chain_api_1.ChainObjectBase.getCompositeKeyFromParts(NodeOperatorAgreement_1.NodeOperatorMetadata.INDEX_KEY, [collection, category, type, additionalKey, instance.toString()]);
    let nodeOperatorMetadata = await (0, chaincode_1.getObjectByKey)(ctx, NodeOperatorAgreement_1.NodeOperatorMetadata, key);
    nodeOperatorMetadata = nodeOperatorMetadata.deactivate();
    nodeOperatorMetadata.validateOrReject();
    await (0, chaincode_1.putChainObject)(ctx, nodeOperatorMetadata);
    return nodeOperatorMetadata.getMetadata();
}
exports.deactivateNode = deactivateNode;
async function updateNode(ctx, { owner, tokenInstanceKey, nodePublicKey }) {
    var _a;
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey;
    const key = chain_api_1.ChainObjectBase.getCompositeKeyFromParts(NodeOperatorAgreement_1.NodeOperatorMetadata.INDEX_KEY, [collection, category, type, additionalKey, instance.toString()]);
    let nodeOperatorMetadata = await (0, chaincode_1.getObjectByKey)(ctx, NodeOperatorAgreement_1.NodeOperatorMetadata, key);
    if (!nodeOperatorMetadata.operatorAgreement && (owner !== ctx.callingUser)) {
        throw new chain_api_1.UnauthorizedError("need to be owner to update!");
    }
    if (nodeOperatorMetadata.operatorAgreement && (((_a = nodeOperatorMetadata.operatorAgreement) === null || _a === void 0 ? void 0 : _a.publicKey) !== ctx.callingUser)) {
        throw new chain_api_1.UnauthorizedError("need to be operator to update!");
    }
    nodeOperatorMetadata = nodeOperatorMetadata.update(nodePublicKey);
    nodeOperatorMetadata.validateOrReject();
    await (0, chaincode_1.putChainObject)(ctx, nodeOperatorMetadata);
    return nodeOperatorMetadata.getMetadata();
}
exports.updateNode = updateNode;
async function fetchNodeMetadata(ctx, { tokenInstanceKey }) {
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey;
    const key = chain_api_1.ChainObjectBase.getCompositeKeyFromParts(NodeOperatorAgreement_1.NodeOperatorMetadata.INDEX_KEY, [collection, category, type, additionalKey, instance.toString()]);
    let nodeOperatorMetadata = await (0, chaincode_1.getObjectByKey)(ctx, NodeOperatorAgreement_1.NodeOperatorMetadata, key);
    return nodeOperatorMetadata.getMetadata();
}
exports.fetchNodeMetadata = fetchNodeMetadata;
//# sourceMappingURL=nodeOperations.js.map