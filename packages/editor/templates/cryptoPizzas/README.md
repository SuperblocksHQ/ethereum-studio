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

After the `pragma` line are a series of `import` statements [that imports all global symbols from another file](https://solidity.readthedocs.io/en/latest/layout-of-source-files.html#importing-other-source-files) to make them available to the current contract.

Adding the `is` keyword after the contract name allows a contract to derive all non-private members from the named external contract including internal functions and state variables. In this example, `CryptoPizza` inherits from the external `IERC721` and `ERC165` contracts.

The `using A for B` directive is a method for attaching library functions to a Solidity type. In this case the [Zeppelin SafeMath](https://docs.openzeppelin.com/contracts/2.x/api/math.html) library that adds overflow checks to any use of the `uint256` type.

This contract introduces [constant variables](https://solidity.readthedocs.io/en/latest/contracts.html#constant-state-variables), these work in a similar way to other programming languages, but constants are not allowed to access storage, blockchain, or execution data, or make calls to external contracts.

[A `struct` type](https://solidity.readthedocs.io/en/latest/types.html#structs) lets you define your own type. In this example `Pizza` is a type that contains a `string` and a `uint`. The [array type](https://solidity.readthedocs.io/en/v0.5.12/types.html#arrays) below the struct definition creates an empty array to contain instances of the `Pizza` type.

[The `mapping` type](https://solidity.readthedocs.io/en/v0.5.12/types.html#mapping-types) is another custom type that lets you define key/value pairs as a content type. The first three are simpler examples that map one value of a certain type to a key of a certain type. For example `mapping (uint => address) public pizzaToOwner` maps an `address` type to a `uint` type inside a mapping called `pizzaToOwner`.

The fourth mapping shows that you can also nest mappings, in this case `mapping (address => mapping (address => bool)) private operatorApprovals;` creates an `address` key type that contains another `address` key that maps to a `bool` type.

The `_createPizza` function introduces several new concepts.

First is the `internal` visibility [keyword](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#visibility-and-getters) that means this function is only visible within the current contract or contracts that derive it.

Second it uses a [function modifier](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#function-modifiers) that accepts the input variables passed to the function, and passes them to another function, that checks a condition is correct before executing the function. The `isUnique` modifier checks to see if the Pizza created exists yet by checking its `_dna` and `_name` using a standard Solidity method for string comparison that compares the byte data.

Once the modifier confirms the Pizza is unique the function adds it to the array and maps it to the owner (creator in this case), using [the `assert` function](https://solidity.readthedocs.io/en/v0.5.12/control-structures.html#id4) to check that the owner address is the same as the address of the current user.
