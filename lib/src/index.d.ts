import "dotenv/config";
import { GalaContract, GalaJSONSerializer } from "@gala-games/chaincode";
export declare const contracts: {
    new (): GalaContract;
}[];
export declare const serializers: {
    transaction: string;
    serializers: {
        galaJsonSerializer: typeof GalaJSONSerializer;
    };
};
