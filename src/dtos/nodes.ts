import { ChainCallDTO, TokenBalance, TokenInstanceKey } from "@gala-games/chain-api";
import { NodeMetadata, NodeOperatorAgreement } from "src/types/NodeOperatorAgreement";

export class SignNodeAgreementDto extends ChainCallDTO {
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string;
    operatorAgreement?: NodeOperatorAgreement;
}

export class ActivateNodeDto extends ChainCallDTO {
    owner?: string;
    lockAuthority?: string;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey: string;
    operatorAgreement?: NodeOperatorAgreement;
    operatorSignature: string;
}

export class ActivateNodeResponse extends ChainCallDTO {
    balance: TokenBalance;
    metadata: NodeMetadata;
}

export class DeactivateNodeDto extends ChainCallDTO {
    owner?: string;
    tokenInstanceKey: TokenInstanceKey;
}

export class UpdateNodeDto extends ChainCallDTO {
    owner?: string;
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey?: string;
    operatorAgreement?: NodeOperatorAgreement;
}

export class FetchNodeMetadataDto extends ChainCallDTO {
    tokenInstanceKey: TokenInstanceKey;
}