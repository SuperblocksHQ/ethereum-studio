# Creating a unique collectible token

This project is an example application that teaches you how to:

-   Write a smart contract and web app that conforms to a token standard.
-   Different variable types in Solidity.
-   Create, update and get variables in a smart contract.
-   Emit events that clients can subscribe to.
-   Provide arguments to a contract constructor using the _Configure contract_ modal.

> Tutorial content supplied by [kauri.io](https://kauri.io).

## Explanation of the template

### The smart contract

> Find the smart contract file in _contracts/CryptoPizza.sol_

After the `pragma` line are a series of `import` statements [that imports all global symbols from another file](https://solidity.readthedocs.io/en/latest/layout-of-source-files.html#importing-other-source-files) to make them available to the current contract.

Adding the `is` keyword after the contract name allows a contract to derive all non-private members from the named external contract including internal functions and state variables. In this example, `CryptoPizza` inherits from the external `IERC721` and `ERC165` contracts.

The `using A for B` directive is a method for attaching library functions to a Solidity type. In this case the [OpenZeppelin Contracts SafeMath](https://docs.openzeppelin.com/contracts/2.x/api/math.html) library that adds overflow checks to any use of the `uint256` type.

This contract introduces [constant variables](https://solidity.readthedocs.io/en/latest/contracts.html#constant-state-variables), these work in a similar way to other programming languages, but you must assign an expression which is constant at compile time. You cannot use any expressions that accesses storage, blockchain data, execution data, or makes calls to external contracts.

[A `struct` type](https://solidity.readthedocs.io/en/latest/types.html#structs) lets you define your own type. In this example `Pizza` is a type that contains a `string` and a `uint`. The [array type](https://solidity.readthedocs.io/en/v0.5.12/types.html#arrays) below the struct definition creates an empty array to contain instances of the `Pizza` type.

[The `mapping` type](https://solidity.readthedocs.io/en/v0.5.12/types.html#mapping-types) is another custom type that lets you define key/value pairs as a content type. The first three are simpler examples that map one value of a certain type to a key of a certain type. For example `mapping (uint => address) public pizzaToOwner` maps an `address` type to a `uint` type inside a mapping called `pizzaToOwner`.

The fourth mapping shows that you can also nest mappings, in this case `mapping (address => mapping (address => bool)) private operatorApprovals;` creates an `address` key type that contains another `address` key that maps to a `bool` type.

The `_createPizza` function introduces several new concepts.

First is the `internal` visibility [keyword](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#visibility-and-getters) that means this function is only visible within the current contract or contracts that derive it.

Second it uses a [function modifier](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#function-modifiers) that accepts the input variables passed to the function, and passes them to another function, that checks a condition is correct before executing the function. The `isUnique` modifier checks to see if the Pizza created exists yet by checking its `_dna` and `_name` using a standard Solidity method for string comparison that compares the byte data.

Once the modifier confirms the Pizza is unique the function adds it to the array and maps it to the owner (creator in this case), using [the `assert` error handling function](https://solidity.readthedocs.io/en/v0.5.12/control-structures.html#id4) to check that the owner address is the same as the address of the current user.

The `createRandomPizza` function is the public function called in JavaScript that assigns the string the user sets in the front end as the name of the pizza and calls the `generateRandomDna` function, passing the name, and the owner.

The `generateRandomDna` introduces another new function modifier, [`pure`](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#pure-functions). Pure functions promise not to read from or modify the state, instead they generally return values to another function that does.

The `getPizzasByOwner` function is another public function called by JavaScript to return all pizzas created by the owner of a specified address. The function introduces another modifier, [`view`](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#view-functions) which promise not to modify the state. The function uses the [`memory`](https://solidity.readthedocs.io/en/latest/introduction-to-smart-contracts.html#storage-memory-and-the-stack) data storage area to only keep a value for the life of the contract call.

The `transferFrom` contract function is called by JavaScript when a user clicks the _Gift_ button for an individual pizza, and transfers ownership to the address specified. The function uses another form of [error handling function](https://solidity.readthedocs.io/en/v0.5.12/control-structures.html#id4), `require` that checks for valid conditions at run time. If all these conditions are correct the function transfers ownership and emits an event (defined in the imported IERC721 contract) to the blockchain recording the ownership transfer.

When the user clicks the _Eat_ button for an individual pizza, JavaScript calls the `burn` contract function that destroys the pizza at the specified id. The `burn` function uses the [`external`](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#visibility-and-getters) function modifier, which makes the function part of the contract interface and can be called from other contracts.

And that's all the code relevant to this dapp, there are other functions for glue code not included here. To see the dapp in action, click _Compile_, then _Deploy_ found under the disclosure triangle of the contract file, then open the _Preview_ tab to see the frontend of the dapp. Try creating one or more pizzas, then gifting them to other accounts (create new accounts from the _Default_ drop down), and eating them 😋.

> Find the HTML file in _app/app.html_
> Find the CSS file in _app/app.css_
> Find the JavaScript file in _app/app.js_

### 1. Configure

Configuring the contract allows you to set the name of the contract and the initial values sent to the constructor as arguments. You can configure the contract by going to the Deploy panel, accessed by clicking on the rocket icon in the left side menu and choosing _Configure_ option. In this example, the constructor doesn't accept arguments by default, so no configuration is necessary.

### 2. Compile

Solidity is a compiled language, and you need to convert the Solidity code into bytecode before the contract can run. We will automatically compile the code every time you save your changes or when performing a deployment.  

### 3. Deploy

Every smart contract runs at an address on the Ethereum blockchain, and you must deploy it to an address before it can run. When using Studio, the browser simulates the network, but there are several test networks and one main network for the Ethereum blockchain.

Deploy the contract by going to the _Deploy_ panel, accessed by clicking on the rocket icon in the left side menu.

## Find out more

You can read a full tutorial that accompanies this example dapp, plus many more tutorials, on [kauri.io](https://kauri.io/article/bdd65d6155a74b8aa52672b46b7230a8/v1/a-fullstack-dapp-for-creating-tokens).

Other resources useful to continue your dapp development journey are:

- [CryptoZombies](https://cryptozombies.io/): Learn Solidity building your own Zombie game
- [Open Zeppelin Ethernaut](https://ethernaut.openzeppelin.com/): Complete levels by hacking smart contracts
- [ChainShot](https://www.chainshot.com/): Solidity, Vyper and Web3.js coding tutorials
- [Consensys Academy](https://consensys.net/academy/bootcamp/): Online Ethereum developer bootcamp
- [Remix](https://remix.ethereum.org/): Web-based IDE for working on Solidity and Vyper smart contracts with in-line compile errors & code auto-complete
- [Ganache](https://www.trufflesuite.com/ganache): One-click blockchain for local development
- [Grid](https://grid.ethereum.org/): Download, configure, and run Ethereum nodes and tools
- [Embark](https://framework.embarklabs.io/) All-in-one platform with smart contract workflows, debugger, testing, and more
