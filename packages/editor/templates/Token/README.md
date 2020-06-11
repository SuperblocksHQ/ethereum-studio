# Token tutorial

This example dapp builds off learnings from our first tutorial, [Hello World](https://studio.ethereum.org/). We recommend you start there.

The goal of this tutorial is to teach you how to:

-   Write and deploy a smart contract that issues [tokens](https://docs.openzeppelin.com/contracts/2.x/tokens)
-   Build a web application that interacts with your smart contract
-   Understand the basics of [Ethereum accounts](https://ethereum.org/whitepaper/#ethereum-accounts) and how they represent both users and smart contracts on the blockchain
-   Transfer tokens between Ethereum accounts by initiating [transactions](https://ethereum.org/whitepaper/#messages-and-transactions) with your smart contract

If you'd like to learn more about how Ethereum works before diving in, we recommend you [start here](https://ethereum.org/learn/).

## Introduction to tokens

**What is a token?**

Ethereum tokens are simply digital assets that are built on top of the Ethereum blockchain using smart contracts. Tokens are used across many Ethereum projects.

**Why create a token?**

A token can serve many purposes,
such as a [stablecoin](https://www.investopedia.com/terms/s/stablecoin.asp),
or to track a point system (such as [Reddit's "community points"](https://www.reddit.com/community-points/)),
or even to represent shares of voting rights over a project. By representing things as tokens, we can allow smart contracts to interact with them, exchange them, create or destroy them.

You may have heard of [ERC20](https://docs.openzeppelin.com/contracts/2.x/erc20), a token standard established by the Ethereum community to promote interopability across applications.
In this example, you'll create a more simple token but we invite you to extend the contract code in order to satisfy the formal specification.

## The smart contract

At its core, a token contract is a mapping of addresses to balances, with some methods to add and subtract from those balances.

Let's find the [smart contract](https://ethereum.org/learn/#smart-contracts).

> Use the Explore panel on the left of the IDE to navigate to the _Files/contracts/Token.sol_ file.

Return here once you've read through the file.

Every smart contract runs at an address on the Ethereum blockchain. You must compile and deploy a smart contract to an address before it can run. When using Studio, your browser simulates the network, but there are several test networks and one main network for the Ethereum blockchain.

### 1. Compile

Solidity is a compiled language, and you need to convert the Solidity code into bytecode before the contract can run. We will automatically compile the code every time you save your contract (by clicking the floppy disk icon at the top of a file) or when performing a deployment.

### 2. Deploy

Now let's deploy the Token.sol contract. In the left panel of the IDE, you'll find the Deploy panel (the rocket icon). Deploy the contract by selecting the "Deploy" button within the Deploy panel.

You should now see successful output from the IDE's Console (lower right panel) and a web form in the IDE's Browser. This form allows you to interact with your deployed token contract.

## The web app (dapp)

As you learned in the Hello World example, dapps typically use a [JavaScript convenience libraries](https://ethereum.org/developers/#frontend-javascript-apis) that provide an API to make integrations with smart contract easier. In this project, you'll again be using [web3.js](https://web3js.readthedocs.io/en/v1.2.8/).

Let's take a look at our application logic.

> Use the Explore panel to navigate to the _Files/app/app.js_ file.

Return here once you've read through the file.

### Interact

Now that you have an understanding of the logic, let's use the app UI to interact with the contract!

**Find your Ethereum address**

At the top right of the IDE, find the Account dropdown menu (the "Default" account is pre-selected). Click to "Copy address" (the paper icon), then paste your address into the "Mint new tokens" address input field. Enter an amount and click "Mint".

Behind the scenes, submitting the form should trigger our JavaScript function, `createTokens`, which creates an Ethereum transaction to call the public function, `mint` on your smart contract and to update the contract's state.

**View you transactions**

Find the "Transactions" tab on the right panel of the IDE. Here you can inspect all transactions you've triggered on your deployed contract.

**Mint tokens**

Try using the Account dropdown menu to create a new Ethereum account, then transfer tokens to that account from your "Default" account (the account you deployed the contract on). You can verify if this worked using the "Check balance of address" form.

## Next Steps

Congratulations! You've made it through our second tutorial. You've taken another important step towards building on Ethereum.

Our final Ethereum Studio tutorial is our most complex example. We recommend you [build a "CryptoPizza NFT"](https://studio.ethereum.org/) next.

## Learn more

Want to learn more about Ethereum tokens?

-   [Read the ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
-   [Learn how standards are established on Ethereum](https://ethereum.org/developers/#standards)
-   [See popular implementations of ERC20 interfaces, contracts and utilities](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20)

Ready to move on from Ethereum Studio? Here's some other useful online resources to continue your dapp development journey:

-   [CryptoZombies](https://cryptozombies.io/): Learn Solidity building your own Zombie game
-   [Open Zeppelin Ethernaut](https://ethernaut.openzeppelin.com/): Complete levels by hacking smart contracts
-   [ChainShot](https://www.chainshot.com/): Solidity, Vyper and Web3.js coding tutorials
-   [Consensys Academy](https://consensys.net/academy/bootcamp/): Online Ethereum developer bootcamp
-   [Remix](https://remix.ethereum.org/): Web-based IDE for working on Solidity and Vyper smart contracts with in-line compile errors & code auto-complete

## Local development

Looking to set up a local Ethereum development environment? [Start here](https://ethereum.org/developers/#developer-tools).
