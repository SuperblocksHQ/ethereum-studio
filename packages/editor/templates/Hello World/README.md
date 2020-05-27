# Hello World

The goal of this "Hello World" project template is to teach you how to:

-   Deploy an [Ethereum smart contract](https://ethereum.org/learn/#smart-contracts) written in the [Solidity programming language](https://ethereum.org/developers/#smart-contract-languages).
-   Store and update state variables of your deployed contract.
-   Fetch your contract's state from the blockchain and render it to a frontend using a [JavaScript library](https://ethereum.org/developers/#frontend-javascript-apis).

If you'd like to learn more about how Ethereum works before diving in, we recommend you [start here](https://ethereum.org/learn/).

## Introduction to the Ethereum Studio IDE

Ethereum Studio is a web-based IDE where you can write, deploy and test smart contracts, and build a frontend application to interact with them.

On the left side of this IDE, you'll find the Explorer panel (the folder icon). Here you can view the file structure of your project. You can toggle the folder icon on the far left to hide or display this panel.

On the right side this IDE, you'll find the Preview panel, where you can view this project's application in the Browser tab. You can toggle the panel icon on the far right to hide or display this preview.

There are additional features of Ethereum Studio that we will introduce in later tutorials but for now, let's move on.

<!-- TODO: For support, go here. -->
<!-- TODO: For documentationm, go here. -->
<!-- TODO: For a video tutorial, go here. -->

## The smart contract

First, let's find the [smart contract](https://ethereum.org/learn/#smart-contracts).

> Use the Explore panel to navigate to the _Files/contracts/HelloWorld.sol_ file.

Return here once you've read through the file.

Every smart contract runs at an address on the Ethereum blockchain. You must compile and deploy a smart contract to an address before it can run. When using Studio, the browser simulates the network, but there are several test networks and one main network for the Ethereum blockchain.

### 1. Compile

Before you deploy the HelloWorld.sol contract, you should understand compilation. Solidity is a compiled language, and you need to convert the Solidity code into bytecode before the contract can run. We will automatically compile the code every time you save your changes (by clicking the floppy disk icon at the top of a file) or when performing a deployment.

### 2. Deploy

Now let's deploy the HelloWorld.sol contract. Again, in the left panel of the IDE, you'll find the Deploy panel (the rocket icon). Here you can configure and deploy your contract to your local network.

Configuring the contract allows you to set the name of the contract as well as the contract's `message` variable by specifying the initial value sent to the constructor function. Configure the contract within the Deploy panel by selecting the "_Configure_" option.

Then deploy the contract by selecting the "_Deploy_" option within the Deploy panel.

You should now see the deployed contract's `message` variable displayed on the IDE's Browser.

### 3. Interact

Now check out the Interaction panel on the left side of this IDE (the mouse icon).

Here you view and interact with your deployed contract using its functions. Try updating the `message` variable using the `update` function. This will create a new Ethereum transaction and you should see the message update in the IDE's Browser.

## The web app (dapp)

Often when creating an Ethereum smart contract, it's useful to create a web application for users to interact with. We call these applications "dapps". [Dapps on Ethereum](https://ethereum.org/dapps/) are web applications backed by Ethereum smart contracts. Instead of using a centralized server or database, these applications rely on the blockchain as a backend for program logic and storage.

Dapps typically use a [JavaScript convenience libraries](https://ethereum.org/developers/#frontend-javascript-apis) that provide an API to make integrations with smart contract easier for developers. In this project, you'll be using [web3.js](https://web3js.readthedocs.io/en/v1.2.8/).

This tutorial won't cover the HTML or CSS since it's not specific to a dapp, although it's worth noting that this application uses jQuery to manipulate the HTML (of _Files/app/app.html_) that is utlimately rendered in our IDE's Browser.

Let's take a look at our application logic.

> Use the Explore panel to navigate to the _Files/app/app.js_ file.

Return here once you've read through the file.

### Interact

Now that you have an understanding of the logic, let's use the app UI to interact with the contract!

Try using the form in the IDE's Browser to set the `message` variable on the contract. Submitting the form should trigger our JavaScrip function, `setMessage`, which creates an Ethereum transaction to update the smart contract state. The new state is then read from the contract and updated in the Browser.

## Next Steps

Congratulations! You've made it through our first tutorial. You've taken your first big step towards developing on Ethereum.

Each of our subsequent Ethereum Studio templates increase in complexity. We recommend you you create a "Coin" project next. Create a new project by selecting the plus symbol in the top-right IDE menu of your screen.

## Learn more

Ready to move on from Ethereum Studio?

Here's some other useful online resources to continue your dapp development journey:

-   [CryptoZombies](https://cryptozombies.io/): Learn Solidity building your own Zombie game
-   [Open Zeppelin Ethernaut](https://ethernaut.openzeppelin.com/): Complete levels by hacking smart contracts
-   [ChainShot](https://www.chainshot.com/): Solidity, Vyper and Web3.js coding tutorials
-   [Consensys Academy](https://consensys.net/academy/bootcamp/): Online Ethereum developer bootcamp
-   [Remix](https://remix.ethereum.org/): Web-based IDE for working on Solidity and Vyper smart contracts with in-line compile errors & code auto-complete

## Local development

Looking to set up a local Ethereum development environment? [Start here](https://ethereum.org/developers/#developer-tools).
