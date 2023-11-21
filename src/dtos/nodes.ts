import { ChainCallDTO, TokenBalance, TokenInstanceKey } from "@gala-games/chain-api";
import { NodeMetadata, NodeOperatorAgreement } from "../types/NodeOperatorAgreement";
import { IsString, IsOptional, ValidateNested, IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class SignNodeAgreementDto extends ChainCallDTO {
    @ValidateNested()
    @Type(() => TokenInstanceKey)
    tokenInstanceKey: TokenInstanceKey;

    nodePublicKey: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => NodeOperatorAgreement)
    operatorAgreement?: NodeOperatorAgreement;
}

export class ActivateNodeDto extends ChainCallDTO {
    owner?: string;
    lockAuthority?: string;

    @ValidateNested()
    @Type(() => TokenInstanceKey)
    tokenInstanceKey: TokenInstanceKey;
    
    nodePublicKey: string;
    
    @IsOptional()
    @ValidateNested()
    @Type(() => NodeOperatorAgreement)
    operatorAgreement?: NodeOperatorAgreement;
    operatorSignature?: string;
}

export class ActivateNodeResponse extends ChainCallDTO {
    @ValidateNested()
    @Type(() => TokenBalance)
    balance: TokenBalance;

    @ValidateNested()
    @Type(() => NodeMetadata)
    metadata: NodeMetadata;
}

export class DeactivateNodeDto extends ChainCallDTO {
    owner?: string;

    @ValidateNested()
    @Type(() => TokenInstanceKey)
    tokenInstanceKey: TokenInstanceKey;
}

export class UpdateNodeDto extends ChainCallDTO {
    owner?: string;

    @ValidateNested()
    @Type(() => TokenInstanceKey)
    tokenInstanceKey: TokenInstanceKey;
    nodePublicKey?: string;
}

export class FetchNodeMetadataDto extends ChainCallDTO {
    @ValidateNested()
    @Type(() => TokenInstanceKey)
    tokenInstanceKey: TokenInstanceKey;
}