import { GalaChainContext } from "@gala-games/chaincode";
import { TokenInstanceKey } from "@gala-games/chain-api";
import { NodeMetadata, NodeOperatorAgreement, NodeOperatorMetadata } from "src/types/NodeOperatorAgreement";
import { ActivateNodeResponse } from "src/dtos/nodes";
interface SignNodeAgreementParams {
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string;
    operatorAgreement: NodeOperatorAgreement | undefined;
}
export declare function signNodeAgreement({ tokenInstanceKey, nodePublicKey, operatorAgreement }: SignNodeAgreementParams): Promise<NodeOperatorMetadata>;
interface ActivateNodeParams extends SignNodeAgreementParams {
    owner: string | undefined;
    lockAuthority: string | undefined;
    expires: number | undefined;
    operatorSignature: string | undefined;
}
export declare function activateNode(ctx: GalaChainContext, { owner, lockAuthority, tokenInstanceKey, expires, nodePublicKey, operatorAgreement, operatorSignature }: ActivateNodeParams): Promise<ActivateNodeResponse>;
interface DeactivateNodeParams {
    owner: string | undefined;
    tokenInstanceKey: TokenInstanceKey;
}
export declare function deactivateNode(ctx: GalaChainContext, { owner, tokenInstanceKey, }: DeactivateNodeParams): Promise<NodeMetadata>;
interface UpdateNodeParams {
    owner: string | undefined;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string | undefined;
    operatorAgreement: NodeOperatorAgreement | undefined;
}
export declare function updateNode(ctx: GalaChainContext, { owner, tokenInstanceKey, nodePublicKey, operatorAgreement }: UpdateNodeParams): Promise<NodeMetadata>;
interface FetchNodeMetadataParams {
    tokenInstanceKey: TokenInstanceKey;
}
export declare function fetchNodeMetadata(ctx: GalaChainContext, { tokenInstanceKey }: FetchNodeMetadataParams): Promise<NodeMetadata>;
export {};
