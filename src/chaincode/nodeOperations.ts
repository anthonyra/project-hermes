import { GalaChainContext, ensureIsAuthorizedBy, getObjectByKey, lockToken, putChainObject } from "@gala-games/chaincode";
import { ChainCallDTO, ChainObjectBase, TokenBalance, TokenClassKey, TokenInstanceKey, UnauthorizedError } from "@gala-games/chain-api";
import { NodeMetadata, NodeOperatorAgreement, NodeOperatorMetadata } from "../types/NodeOperatorAgreement";
import { ActivateNodeResponse, SignNodeAgreementDto } from "../dtos/nodes";
import { BigNumber } from "bignumber.js";
import { plainToInstance } from "class-transformer";

interface SignNodeAgreementParams {
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string;
    operatorAgreement: NodeOperatorAgreement | undefined;
}
export async function signNodeAgreement({
    tokenInstanceKey,
    nodePublicKey, 
    operatorAgreement 
}: SignNodeAgreementParams): Promise<NodeOperatorMetadata> {
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey;
    const nodeOperatorMetadata = plainToInstance(NodeOperatorMetadata, {
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

interface ActivateNodeParams extends SignNodeAgreementParams {
    owner: string | undefined;
    lockAuthority: string | undefined;
    expires: number | undefined;
    operatorSignature: string | undefined; 
}
export async function activateNode(ctx: GalaChainContext, { 
    owner, 
    lockAuthority, 
    tokenInstanceKey, 
    expires, 
    nodePublicKey, 
    operatorAgreement,
    operatorSignature
}: ActivateNodeParams): Promise<ActivateNodeResponse> {
    if (owner !== ctx.callingUser) {
        throw new UnauthorizedError("need to be the owner!")
    }

    if (operatorAgreement && (operatorSignature ?? "").length == 0) {
        throw new UnauthorizedError("missing operator signature!")
    }
    
    if (operatorAgreement && operatorSignature) {
        const operatorDto = ChainCallDTO.deserialize(SignNodeAgreementDto, operatorSignature);
        await ensureIsAuthorizedBy(ctx, operatorDto, operatorAgreement?.publicKey ?? "");
        
        const { tokenInstanceKey: operatorTIK, nodePublicKey: operatorNPK, operatorAgreement: operatorOA } = operatorDto;
        if (JSON.stringify(tokenInstanceKey) !== JSON.stringify(operatorTIK)) {
            throw new UnauthorizedError("token mismatch!")
        }
        
        if (nodePublicKey !== operatorNPK) {
            throw new UnauthorizedError("node key mismatch!")
        }
        
        if (JSON.stringify(operatorAgreement) !== JSON.stringify(operatorOA)) {
            throw new UnauthorizedError("operator agreement mismatch!")
        }
    }

    const balance: TokenBalance = await lockToken(ctx, {
        owner,
        lockAuthority,
        tokenInstanceKey,
        quantity: new BigNumber(1),
        allowancesToUse: [],
        name: undefined,
        expires: expires ?? 0,
        verifyAuthorizedBridgeUser: async (c: TokenClassKey) => undefined
    });

    const nodeOperatorMetadata = await signNodeAgreement({ 
        tokenInstanceKey,
        nodePublicKey, 
        operatorAgreement, 
    })

    await putChainObject(ctx, nodeOperatorMetadata);
    const metadata = nodeOperatorMetadata.getMetadata();

    return plainToInstance(ActivateNodeResponse, { balance, metadata })
};

interface DeactivateNodeParams {
    owner: string | undefined;
    tokenInstanceKey: TokenInstanceKey;
}
export async function deactivateNode(ctx: GalaChainContext, {
    owner,
    tokenInstanceKey,
}: DeactivateNodeParams): Promise<NodeMetadata> {
    if (owner !== ctx.callingUser) {
        throw new UnauthorizedError("need to be the owner!")
    }

    const { collection, category, type, additionalKey, instance } = tokenInstanceKey
    const key = ChainObjectBase.getCompositeKeyFromParts(NodeOperatorMetadata.INDEX_KEY, [collection, category, type, additionalKey, instance.toString()])
    let nodeOperatorMetadata = await getObjectByKey(ctx, NodeOperatorMetadata, key);
    nodeOperatorMetadata = nodeOperatorMetadata.deactivate();
    
    nodeOperatorMetadata.validateOrReject();

    await putChainObject(ctx, nodeOperatorMetadata);
    return nodeOperatorMetadata.getMetadata()
}
interface UpdateNodeParams {
    owner: string | undefined;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string | undefined;
}
export async function updateNode(ctx: GalaChainContext, {
    owner,
    tokenInstanceKey,
    nodePublicKey
}: UpdateNodeParams): Promise<NodeMetadata> {
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey
    const key = ChainObjectBase.getCompositeKeyFromParts(NodeOperatorMetadata.INDEX_KEY, [collection, category, type, additionalKey, instance.toString()])
    let nodeOperatorMetadata = await getObjectByKey(ctx, NodeOperatorMetadata, key);

    if (!nodeOperatorMetadata.operatorAgreement && (owner !== ctx.callingUser)) {
        throw new UnauthorizedError("need to be owner to update!")
    }
    
    if (nodeOperatorMetadata.operatorAgreement && (nodeOperatorMetadata.operatorAgreement?.publicKey !== ctx.callingUser)) {
        throw new UnauthorizedError("need to be operator to update!")
    }

    nodeOperatorMetadata = nodeOperatorMetadata.update(nodePublicKey);
    nodeOperatorMetadata.validateOrReject();
    
    await putChainObject(ctx, nodeOperatorMetadata);
    return nodeOperatorMetadata.getMetadata()
}

interface FetchNodeMetadataParams {
    tokenInstanceKey: TokenInstanceKey;
}
export async function fetchNodeMetadata(ctx: GalaChainContext, {
    tokenInstanceKey
}: FetchNodeMetadataParams): Promise<NodeMetadata> {
    const { collection, category, type, additionalKey, instance } = tokenInstanceKey
    const key = ChainObjectBase.getCompositeKeyFromParts(NodeOperatorMetadata.INDEX_KEY, [collection, category, type, additionalKey, instance.toString()])
    let nodeOperatorMetadata = await getObjectByKey(ctx, NodeOperatorMetadata, key);
    return nodeOperatorMetadata.getMetadata();
}