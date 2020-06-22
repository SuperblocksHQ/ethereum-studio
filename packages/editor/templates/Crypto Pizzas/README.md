# CryptoPizza

This example dapp builds off learnings from our previous tutorials, Hello World and Token. We recommend you [start there](https://studio.ethereum.org/).

The goal of this tutorial is to teach you how to:

-   Create a unique collectible token
-   Write a smart contract that conforms to a [token standard](https://ethereum.org/developers/#standards)
-   Import contracts and implement smart contract inheritance
-   Build a web application that interacts with your smart contract

## Introduction to non-fungible tokens (NFTs)

**What is an NFT?**

In the previous Token example, we introduced Ethereum tokens and a few of their use cases.

The tokens we created were [fungible](https://en.wikipedia.org/wiki/Fungibility) tokens - each individual token was interchangable and indistinguishable from each other.
Fiat currencies (e.g. USD, EUR), commodities (e.g. gold bars, oil barrels) and most cryptocurrencies (e.g. [Ether](https://ethereum.org/eth/), Bitcoin) are examples of fungible goods.

[Non-fungible tokens (NFTs)](https://en.wikipedia.org/wiki/Non-fungible_token) are a particular type of token used when individual tokens must be unique and distinguishable from others.
While fungible tokens can be useful as currencies or shares of a company, NFTs can be used to represent ownership of real estate (because no two houses are the same) or collectibles like digital art.
NFTs come in handy whenever some items (represented by tokens) are valued more than others, due to their usefulness, rarity, or other features.

**Token standards**

In the Token example we touched on the ERC20 standard to build fungible tokens.

[ERC721](http://erc721.org/) is a standard interface for non-fungible tokens. It's a more complex standard than ERC20, with optional extensions and functionality often split accross multiple contracts.
In this example, you'll see a full implementation of this standard.

## The smart contract

First, find the smart contract.

> Use the Explore panel on the left of the IDE to navigate to the _Files/contracts/CryptoPizza.sol_ file.

Return here once you've read through the file.

Every smart contract runs at an address on the Ethereum blockchain. You must compile and deploy a smart contract to an address before it can run. When using Studio, your browser simulates the network, but there are several test networks and one main network for the Ethereum blockchain.

### Deploy

In the left panel of the IDE, you'll find the Deploy panel (the rocket icon). Deploy the CryptoPizza.sol contract by selecting the "Deploy" button within the Deploy panel (we will automatically compile it first).

You should now see successful output from the IDE's Console (lower right panel) and a web app in the IDE's Browser. This app allows you to interact with your deployed token contract.

## The web app (dapp)

Similar to our previous examples, this dapps uses [web3.js](https://web3js.readthedocs.io/en/v1.2.8/), a [JavaScript convenience library](https://ethereum.org/developers/#frontend-javascript-apis) that makes integrations with smart contracts easier.

Let's take a look at our application logic.

> Use the Explore panel to navigate to the _Files/app/app.js_ file.

Return here once you've read through the file.

### Interact

Now that you have an understanding of the logic, let's use the app UI (in the Browser tab) to interact with the contract!

**Create a CryptoPizza**

Create a CryptoPizza by entering a name in the form and clicking "Create".

Under the hood, this triggers the `createRandomPizza` JavaScript function, which in turn calls the CryptoPizza.sol function of the same name.
The string the user sets in the form input field is used in the `generateRandomDna` which, in tandem with the sender's Ethereum address, is used to create a unique token.

**Eat a CryptoPizza**

Clicking the "Eat" button on a pizza in your "Inventory" triggers the JavaScript to call the `burn` contract function, which destroys the token at the specified id.

**Gift a CryptoPizza**

Clicking the "Gift" button triggers the `transferFrom` contract function, which transfers ownership of the token to the address specified.

Try to create a few CryptoPizzas, then gift them to other accounts and eat them 😋.

## Next Steps

Congratulations! You've made it through our final tutorial. You're well on your way to becoming an Ethereum developer.

**Want to learn more about ERC721 tokens?**

-   [Read the ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-721)
-   [Learn how standards are established on Ethereum](https://ethereum.org/developers/#standards)
-   [See popular implementations of ERC20 interfaces, contracts and utilities](https://docs.openzeppelin.com/contracts/2.x/api/token/erc721)

**Ready to keep building?**
Here's some other useful online resources to continue your dapp development journey:

-   [CryptoZombies](https://cryptozombies.io/): Learn Solidity building your own Zombie game
-   [Open Zeppelin Ethernaut](https://ethernaut.openzeppelin.com/): Complete levels by hacking smart contracts
-   [ChainShot](https://www.chainshot.com/): Solidity, Vyper and Web3.js coding tutorials
-   [Consensys Academy](https://consensys.net/academy/bootcamp/): Online Ethereum developer bootcamp
-   [Remix](https://remix.ethereum.org/): Web-based IDE for working on Solidity and Vyper smart contracts with in-line compile errors & code auto-complete

**Looking to set up a local Ethereum development environment?**
[Start here](https://ethereum.org/developers/#developer-tools).
