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
  BurnTokensDto,
  createValidDTO,
  FetchBalancesDto,
  TokenBalance,
  TokenBurn,
  TokenClassKey,
  TokenInstanceKey
} from "@gala-games/chain-api";
import BigNumber from "bignumber.js";
import { instanceToPlain, plainToClass as plainToInstance } from "class-transformer";
import {
  ChainClients,
  createChainClient,
  createRegisteredUser,
  mintTokensToUsers,
  randomize,
  transactionSuccess,
  UserConfig
} from "@gala-games/chain-test";

describe("NFT Burn scenario", () => {
  let client: ChainClients;
  let user1: UserConfig;
  let user2: UserConfig;

  const nftClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: randomize("Platform").slice(0, 20),
    category: "Currency",
    type: "GALA",
    additionalKey: "none"
  });

  beforeAll(async () => {
    client = await createChainClient();
    user1 = await createRegisteredUser(client);
    user2 = await createRegisteredUser(client);

    await mintTokensToUsers(client, nftClassKey, [
      { user: user1, quantity: new BigNumber(1) },
      { user: user2, quantity: new BigNumber(1) }
    ]);
  });

  afterAll(async () => {
    await client.disconnect();
  });

  it("User should burn tokens", async () => {
    // Given
    const burnTokensDto = await createValidDTO<BurnTokensDto>(BurnTokensDto, {
      tokenInstances: [
        {
          tokenInstanceKey: TokenInstanceKey.nftKey(nftClassKey, 1),
          quantity: new BigNumber(1)
        }
      ]
    });

    // When
    const burnTokenResponse = await client.assets.submitTransaction<TokenBurn[]>(
      "BurnTokens",
      burnTokensDto.signed(user1.privateKey, false),
      TokenBurn
    );

    // Then
    expect(burnTokenResponse).toEqual(transactionSuccess());
  });

  it("Should confirm token burn was successful", async () => {
    // Given
    const user1TokenInstances = await createValidDTO(FetchBalancesDto, {
      owner: user1.identityKey,
      ...instanceToPlain(nftClassKey)
    });

    // When
    const user1checkResponse = await client.assets.evaluateTransaction(
      "FetchBalances",
      user1TokenInstances,
      TokenBalance
    );

    // Then
    expect((user1checkResponse.Data ?? [])[0].instanceIds).toEqual([]);
  });
});
