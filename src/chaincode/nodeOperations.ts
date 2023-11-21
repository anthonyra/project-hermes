import { GalaChainContext, ensureIsAuthorizedBy, getObjectByKey, lockToken, putChainObject } from "@gala-games/chaincode";
import { ChainCallDTO, TokenBalance, TokenClassKey, TokenInstanceKey, UnauthorizedError } from "@gala-games/chain-api";
import { NodeMetadata, NodeOperatorAgreement, NodeOperatorMetadata } from "src/types/NodeOperatorAgreement";
import { ActivateNodeResponse, SignNodeAgreementDto } from "src/dtos/nodes";
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

    if (operatorAgreement && !operatorSignature) {
        throw new UnauthorizedError("missing operator signature!")
    }
    
    if (operatorAgreement && operatorSignature) {
        const operatorDto = ChainCallDTO.deserialize(SignNodeAgreementDto, operatorSignature);
        await ensureIsAuthorizedBy(ctx, operatorDto, operatorAgreement?.publicKey);
        
        const { tokenInstanceKey: operatorTIK, nodePublicKey: operatorNPK, operatorAgreement: operatorOA } = operatorDto;
        if (JSON.stringify(tokenInstanceKey) !== JSON.stringify(operatorTIK) || nodePublicKey !== operatorNPK || JSON.stringify(operatorAgreement) !== JSON.stringify(operatorOA)) {
            throw new UnauthorizedError("operator agreement verification failed!")
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

    const { instance } = tokenInstanceKey;
    let nodeOperatorMetadata = await getObjectByKey(ctx, NodeOperatorMetadata, instance.toString());
    nodeOperatorMetadata = nodeOperatorMetadata.deactivate();
    
    nodeOperatorMetadata.validateOrReject();

    await putChainObject(ctx, nodeOperatorMetadata);
    return nodeOperatorMetadata.getMetadata()
}

interface UpdateNodeParams {
    owner: string | undefined;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string | undefined;
    operatorAgreement: NodeOperatorAgreement | undefined;
}
export async function updateNode(ctx: GalaChainContext, {
    owner,
    tokenInstanceKey,
    nodePublicKey,
    operatorAgreement
}: UpdateNodeParams): Promise<NodeMetadata> {
    if (owner !== ctx.callingUser) {
        throw new UnauthorizedError("need to be the owner!")
    }
    
    const { instance } = tokenInstanceKey;
    let nodeOperatorMetadata = await getObjectByKey(ctx, NodeOperatorMetadata, instance.toString());
    nodeOperatorMetadata = nodeOperatorMetadata.update(nodePublicKey, operatorAgreement);
    
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
    const { instance } = tokenInstanceKey;
    let nodeOperatorMetadata = await getObjectByKey(ctx, NodeOperatorMetadata, instance.toString());
    return nodeOperatorMetadata.getMetadata();
}