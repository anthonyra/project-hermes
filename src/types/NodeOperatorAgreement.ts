import { ChainObjectBase } from "@gala-games/chain-api";
import { BigNumber } from "bignumber.js";
import { ChainKey } from "@gala-games/chain-api";
import { IsString, IsOptional, ValidateNested } from "class-validator";


/**
 * @param key - publicKey associated to node operator
 * @param fee - percentage to split distribution by 
 */
export interface NodeOperatorAgreement {
    publicKey: string;
    fee: number;
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

    @IsString()
    nodePublicKey?: string;

    @IsOptional()
    @ValidateNested()
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

    update(nodePublicKey?: string, operatorAgreement?: NodeOperatorAgreement): NodeOperatorMetadata {
        if (nodePublicKey) this.nodePublicKey = nodePublicKey;
        if (operatorAgreement) this.operatorAgreement = operatorAgreement;
        return this;
    };
}

export class NodeMetadata {
    nodePublicKey: string | undefined;
    operatorAgreement?: NodeOperatorAgreement | undefined;
}

