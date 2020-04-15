# Empty dapp project

This is a bare bones dapp project containing a smart contract and boilerplate app files to get started, or to create a template to use with Studio.

## The smart contract

> Find the smart contract file in _contracts/MyContract.sol_

### 1. Configure

Configuring the contract allows you to set the name of the contract and the initial values sent to the constructor as arguments.  You can configure the contract by going to the Deploy panel, accessed by clicking on the rocket icon in the left side menu and choosing _Configure_ option.

### 2. Compile

Solidity is a compiled language, and you need to convert the Solidity code into bytecode before the contract can run. We will automatically compile the code every time you save your changes or when performing a deployment.  

### 3. Deploy

Every smart contract runs at an address on the Ethereum blockchain, and must be deployed to an address before it can run. When using Studio, the browser simulates the network, but there are several test networks and one main network for the Ethereum blockchain.

Deploy the contract by going to the _Deploy_ panel, accessed by clicking on the rocket icon in the left side menu.

## Where to go from here

1.  Try the other tutorials to find out more how to build a dapp.
2.  Build!
3.  Click the _Share_ button in the top toolbar, there are several ways to share your project to the world.
    1.  Submit a tutorial to [Kauri.io](https://kauri.io/write-article), remember you can embed Studio projects in the article from the share button.
    2.  If you want your project considered as a default template for new learners, [open a pull request](https://github.com/SuperblocksHQ/ethereum-studio/pulls) to our GitHub repository with your project inside _packages/templates_.
