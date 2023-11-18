## Product Chaincode

This project is for the Contract, DTOs, Types, and any other supporting classes needed to add Product or Game functionality to an instance of the Chain.

It should be used as a template for creating new product or game chaincodes replacing "Product" and "product" with the name like "SpiderTanks", "spiderTanks", more details how to do it in [NEXT_STEPS.md](./NEXT_STEPS.md)

## Local Environment

### Requirements

Install `yq` command

    https://github.com/mikefarah/yq

Install `jq` command

    sudo apt install -y jq

Login to Docker using the GitLab username and token

    docker login -u $USERNAME -p $GITLAB_TOKEN registry.gitlab.com

Copy the content from `.npmrc_template` and set up a `.npmrc` file in the root project directory and make sure to replace the **AUTH-TOKEN-HERE** with your GitLab token

### Local Network Configuration

In your local terminal in the root of the project

    npm run network:start

To take down and remove the network

    npm run network:prune

Recreate the network

    npm run network:recreate

Update the script `network:start` in [package.json](https://gitlab.com/gala-games/chain/onboarding-kit/product-chaincode-template/-/blob/main/package.json) to use the name of the channel and chaincode

### Local Network Dev Mode

In order to make integration tests working, you need to provide `GALA_CLIENT_DEV_MODE=true` environment variable for your tests.

In your local terminal in the root of the project

    npm run network:start-dev

It will start local GalaChain network and run the sample project in watch mode (hot-reload).
Once you update the code, it will automatically apply the changes to the network.

After run the network in dev mode, you can run the e2e tests

    npm run test:e2e

You can also verify the changes in block browser and GraphQL

    http://localhost:3010/blocks

    http://localhost:3010/graphiql

To take down and remove the network

    npm run network:prune-dev

## Dev Conatiners Environment

### Requirements
- Authenticating **docker** and **npm** to the gala gitlab registry: set up a `.gitlab-env` file in the root project directory with the provided values for your Gitlab account:
    ```
    USERNAME=issued-username
    GITLAB_TOKEN=issued-token
    ```
    Docker and npm configs will be updated on network startup
- Install the VSCode extension here: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
- Open command pallete and run `Dev Containers: Open Folder in Container` and select project root.
- If using apple silicon cpu architecture, please run the following command:
```
docker pull --platform linux/x86_64 hyperledger/fabric-nodeenv:2.4
```

### Dev Conatiners Network Configuration

Update the [fablo-config.json](https://gitlab.com/gala-games/chain/onboarding-kit/product-chaincode-template/-/blob/main/bin/fablo-config.json) to use the name of the channel and chaincode

In the project-chaincode-template directory:

    npm run network:devcontainer-start

The prune commands allow you to take down and remove the network

    network:devcontainer-prune

To update chaincode on the network without prune/up, in the test-network directory:

    `VERSION=X npm run chaincode:upgrade`

Where X is a number higher than the last version (or 1 after initial up)

Here are the commands details:

    Options:
        --help          Show help  [boolean]
        --version       Show version number  [boolean]
        -C, --channel       Channel name.  [string]
        -t, --channelType   Channel type. Can be "curator" or "partner". It means whether this is a chaincode managed by CuratorOrg or PartnerOrg.  [string]
        -n, --chaincode     Chaincode name.  [string]
        -d, --chaincodeDir  Root directory of chaincode source, relative to fabloRoot. By default '.' is used.  [string]
        -r, --fabloRoot     Root directory of target network. Should not be the same as chaincodeDir and should not be a child of chaincodeDir. By default './test-network' is used.  [string]
            --opsApiConfig  Path to Operation API config. If missing, Operation API is not started.  [string]
            --envConfig     Path to .env file to be used for chaincodes.  [string]


## Chaincode Types

    Token types for instances are built in. You can create new types to store data on chain.

## Methods

CreatePlayerProfile

    Writes a new profile, playerId is required. Initial set of profileItems may also be specified.
    
UpdatePlayerProfile

    Allows direct update of profile items. May not be desired upon full release.

FetchPlayerProfile

    Read a single profile from the chain by providing a playerId

BuyProfileItem

    Adds an amount to profile items. Can also subtract profile items to pay for the purchased item.

SpendProfileItem

    Subtracts an amount from profile items. Unlike BuyProfileItem, this is useful for initiating some in-game action by spending profile item(s)

CreateTokenMetadata

    Writes a new Token Metadata record, tokenInstanceKey is required. Initial set of metadata values may also be specified.

UpgradeTokenMetadata

    Token metadata values can be modified (added to or subtracted from) and player profile items can be spent in an atomic write. If the item being added is new, it will be added to the array with the provided value.

FetchTokenMetadata

    Read a single metadata record from the chain by providing a tokenInstanceKey   