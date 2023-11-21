import { ChainObjectBase } from "@gala-games/chain-api";
import { BigNumber } from "bignumber.js";
/**
 * @param key - publicKey associated to node operator
 * @param fee - percentage to split distribution by
 */
export declare class NodeOperatorAgreement {
    publicKey?: string;
    fee?: number;
}
export declare class NodeOperatorMetadata extends ChainObjectBase {
    static INDEX_KEY: string;
    collection: string;
    category: string;
    type: string;
    additionalKey: string;
    instance: BigNumber;
    nodePublicKey?: string;
    operatorAgreement?: NodeOperatorAgreement;
    getMetadata(): NodeMetadata;
    deactivate(): NodeOperatorMetadata;
    update(nodePublicKey?: string): NodeOperatorMetadata;
}
export declare class NodeMetadata {
    nodePublicKey: string | undefined;
    operatorAgreement?: NodeOperatorAgreement | undefined;
}
