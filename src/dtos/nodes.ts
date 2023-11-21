import { ChainCallDTO, TokenBalance, TokenInstanceKey } from "@gala-games/chain-api";
import { NodeMetadata, NodeOperatorAgreement } from "src/types/NodeOperatorAgreement";

export declare class SignNodeAgreementDto extends ChainCallDTO {
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string;
    operatorAgreement?: NodeOperatorAgreement;
}

export declare class ActivateNodeDto extends ChainCallDTO {
    owner?: string;
    lockAuthority?: string;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string;
    operatorAgreement?: NodeOperatorAgreement;
    operatorSignature: string;
}

export declare class ActivateNodeResponse extends ChainCallDTO {
    balance: TokenBalance;
    metadata: NodeMetadata;
}

export declare class DeactivateNodeDto extends ChainCallDTO {
    owner?: string;
    tokenInstanceKey: TokenInstanceKey;
}

export declare class UpdateNodeDto extends ChainCallDTO {
    owner?: string;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey?: string;
    operatorAgreement?: NodeOperatorAgreement;
}

export declare class FetchNodeMetadataDto extends ChainCallDTO {
    tokenInstanceKey: TokenInstanceKey;
}