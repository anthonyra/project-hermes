/*
 * Copyright (c) Gala Games Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ChainClients,
  createChainClient,
  createRegisteredUser,
  createTransferDto,
  mintTokensToUsers,
  randomize,
  transactionError,
  transactionErrorKey,
  transactionSuccess,
  UserConfig
} from "@gala-games/chain-test";
import {
  AllowanceType,
  createValidDTO,
  GrantAllowanceDto,
  LockTokensDto,
  TokenAllowance,
  TokenBalance,
  TokenClassKey,
  TokenInstanceKey,
  UnlockTokensDto
} from "@gala-games/chain-api";
import BigNumber from "bignumber.js";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { ActivateNodeDto, ActivateNodeResponse, SignNodeAgreementDto } from "../src/dtos/index";
import { NodeOperatorMetadata } from "../src/types/index";

describe("NFT lock scenario", () => {
  let client: ChainClients;
  let user1: UserConfig;
  let user2: UserConfig;

  const nftClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: randomize("Platform").slice(0, 20),
    category: "Currency",
    type: "GALA",
    additionalKey: "none"
  });

  const token1Key = TokenInstanceKey.nftKey(nftClassKey, 1);

  beforeAll(async () => {
    client = await createChainClient();
    user1 = await createRegisteredUser(client);
    user2 = await createRegisteredUser(client);

    await mintTokensToUsers(client, nftClassKey, [
      { user: user1, quantity: new BigNumber(2) },
      { user: user2, quantity: new BigNumber(1) }
    ]);
  });

  afterAll(async () => {
    await client.disconnect();
  });

  it("User1 should lock own token", async () => {
    // Given
    const lockDto = await createValidDTO<LockTokensDto>(LockTokensDto, {
      lockAuthority: user1.identityKey,
      tokenInstances: [
        {
          tokenInstanceKey: token1Key,
          quantity: new BigNumber(1)
        }
      ]
    });

    // When
    const lockResult = await client.assets.submitTransaction<TokenBalance>(
      "LockTokens",
      lockDto.signed(user1.privateKey, false),
      TokenBalance
    );

    // Then
    expect(lockResult).toEqual(transactionSuccess());
  });

  it("User1 cannot transfer locked token", async () => {
    // Given
    const transferDto = await createTransferDto(nftClassKey, {
      from: user1.identityKey,
      to: user2.identityKey,
      tokenInstance: new BigNumber(1)
    });

    // When
    const transferResponse = await client.assets.submitTransaction(
      "TransferToken",
      transferDto.signed(user1.privateKey, false)
    );

    // Then
    expect(transferResponse).toEqual(transactionErrorKey("TOKEN_LOCKED"));
  });

  it("User1 can transfer token after unlock", async () => {
    // Given
    const unlockDto = await createValidDTO<UnlockTokensDto>(UnlockTokensDto, {
      tokenInstances: [
        {
          tokenInstanceKey: TokenInstanceKey.nftKey(nftClassKey, 1),
          quantity: new BigNumber(1)
        }
      ]
    });

    await client.assets.submitTransaction<UnlockTokensDto>(
      "UnlockTokens",
      unlockDto.signed(user1.privateKey, false),
      UnlockTokensDto
    );

    const transferDto = await createTransferDto(nftClassKey, {
      from: user1.identityKey,
      to: user2.identityKey,
      tokenInstance: new BigNumber(1)
    });

    // When
    const transferResponse = await client.assets.submitTransaction(
      "TransferToken",
      transferDto.signed(user1.privateKey, false)
    );

    // Then
    expect(transferResponse).toEqual(transactionSuccess());
  });

  // current state: token 1 - locked, quantity = 1
  // TODO: This test is skipped due to a bug https://gitlab.com/gala-games/chain/assets-chaincode/-/issues/138
  it.skip("Only lock authority can unlock token", async () => {
    // Given
    const lockDto = await createValidDTO<LockTokensDto>(LockTokensDto, {
      lockAuthority: user1.identityKey,
      tokenInstances: [
        {
          tokenInstanceKey: TokenInstanceKey.nftKey(nftClassKey, 2),
          quantity: new BigNumber(1),
          owner: user1.identityKey
        }
      ]
    });

    const unlockDto = await createValidDTO<UnlockTokensDto>(UnlockTokensDto, {
      tokenInstances: [
        {
          tokenInstanceKey: TokenInstanceKey.nftKey(nftClassKey, 2),
          quantity: new BigNumber(1)
        }
      ]
    });

    const lockResponse = await client.assets.submitTransaction<LockTokensDto>(
      "LockTokens",
      lockDto.signed(user1.privateKey, false),
      LockTokensDto
    );

    expect(lockResponse).toEqual(transactionSuccess());

    // When
    const unlockResult1 = await client.assets.submitTransaction<UnlockTokensDto>(
      "UnlockTokens",
      unlockDto.signed(user2.privateKey, false),
      UnlockTokensDto
    );
    const unlockResult2 = await client.assets.submitTransaction<UnlockTokensDto>(
      "UnlockTokens",
      unlockDto.signed(user1.privateKey, false),
      UnlockTokensDto
    );

    // Then
    expect(unlockResult1).toEqual(transactionError());
    expect(unlockResult2).toEqual(transactionSuccess());
  });
});

describe("lock with allowances", () => {
  let client: ChainClients;
  let user1: UserConfig;
  let user2: UserConfig;
  let operator: UserConfig;
  let node: UserConfig;

  const nftClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: randomize("Platform").slice(0, 20),
    category: "Currency",
    type: "GALA",
    additionalKey: "none"
  });

  const token2Key = TokenInstanceKey.nftKey(nftClassKey, 2);

  beforeAll(async () => {
    client = await createChainClient();
    user1 = await createRegisteredUser(client);
    user2 = await createRegisteredUser(client);
    operator = await createRegisteredUser(client);
    node = await createRegisteredUser(client);

    await mintTokensToUsers(client, nftClassKey, [
      { user: user1, quantity: new BigNumber(2) },
      { user: user2, quantity: new BigNumber(1) }
    ]);
  });

  afterAll(async () => {
    await client.disconnect();
  });
  it("User1 grants lock allowance for token to User2", async () => {
    const galaAllowanceDto = await createValidDTO<GrantAllowanceDto>(GrantAllowanceDto, {
      tokenInstance: token2Key.toQueryKey(),
      allowanceType: AllowanceType.Lock,
      quantities: [{ user: user2.identityKey, quantity: new BigNumber(1) }],
      uses: new BigNumber(1)
    });

    const result = await client.assets.submitTransaction<TokenAllowance[]>(
      "GrantAllowance",
      galaAllowanceDto.signed(user1.privateKey, false),
      TokenAllowance
    );

    expect(instanceToPlain(result)).toEqual(transactionSuccess());
  });

  it("User2 can lock User1 token", async () => {
    const operatorDto = await createValidDTO<SignNodeAgreementDto>(SignNodeAgreementDto, {
      tokenInstanceKey: token2Key,
      nodePublicKey: node.identityKey,
      operatorAgreement: {
        publicKey: operator.identityKey,
        fee: 10
      }
    });

    const signedOperatorDto = await client.assets.evaluateTransaction<NodeOperatorMetadata>(
      "SignNodeAgreement",
      operatorDto.signed(operator.privateKey, false),
      NodeOperatorMetadata
    );

    const activateNodeDto = await createValidDTO<ActivateNodeDto>(ActivateNodeDto, {
      owner: user1.identityKey,
      lockAuthority: user2.identityKey,
      tokenInstanceKey: token2Key,
      nodePublicKey: node.identityKey,
      operatorAgreement: {
        publicKey: operator.identityKey,
        fee: 10
      },
      operatorSignature: signedOperatorDto.Data ? signedOperatorDto.Data.serialize() : ""
    });

    // When
    const activateResult = await client.assets.submitTransaction<ActivateNodeResponse>(
      "ActivateNode",
      activateNodeDto.signed(user2.privateKey, false),
      ActivateNodeResponse
    );

    // Then
    expect(activateResult).toEqual(transactionSuccess());
  });
});
