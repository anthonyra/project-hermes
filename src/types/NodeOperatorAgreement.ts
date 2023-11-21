import { ChainObjectBase } from "@gala-games/chain-api";
import { BigNumber } from "bignumber.js";
import { ChainKey } from "@gala-games/chain-api";
import { IsString, IsOptional, ValidateNested, IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";

/**
 * @param key - publicKey associated to node operator
 * @param fee - percentage to split distribution by 
 */
export class NodeOperatorAgreement {
    @IsOptional()
    @IsString()
    publicKey?: string;

    @IsOptional()
    @IsNumber()
    fee?: number;
}

export class NodeOperatorMetadata extends ChainObjectBase {
    public static INDEX_KEY: string = "GCNOM";
    @ChainKey({ position: 0 })
    collection: string;

    @ChainKey({ position: 1 })
    category: string;

    @ChainKey({ position: 2 })
    type: string;

    @ChainKey({ position: 3 })
    additionalKey: string;

    @ChainKey({ position: 4 })
    instance: BigNumber;

    @IsOptional()
    @IsString()
    nodePublicKey?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => NodeOperatorAgreement)
    operatorAgreement?: NodeOperatorAgreement;

    getMetadata(): NodeMetadata {
        return { 
            nodePublicKey: this.nodePublicKey, 
            operatorAgreement:this.operatorAgreement 
        }
    }

    deactivate(): NodeOperatorMetadata {
        this.nodePublicKey = undefined;
        this.operatorAgreement = undefined;
        return this
    };

    update(nodePublicKey?: string): NodeOperatorMetadata {
        if (nodePublicKey) this.nodePublicKey = nodePublicKey;
        return this;
    };
}

export class NodeMetadata {
    nodePublicKey: string | undefined;
    operatorAgreement?: NodeOperatorAgreement | undefined;
}

