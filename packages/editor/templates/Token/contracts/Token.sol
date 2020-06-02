pragma solidity ^0.5.10;

// TODO remove duplicate explanations from HelloWorld.sol
contract Token {
    // An Ethereum address is used to identify an account, similar to an email address.
    // Addresses can can represent a smart contract or an external (user) accounts.
    // Learn more: https://solidity.readthedocs.io/en/v0.5.3/types.html#address
    address public owner;

    // A mapping is essentially a hash table data structure.
    // This mapping assigns an unsigned integer (the token balance) to an address (the token holder).
    // Learn more: https://solidity.readthedocs.io/en/v0.5.3/types.html#mapping-types
    mapping (address => uint) public balances;


    // Events allow for logging of activity on the blockchain.
    // Ethereum clients can listen for events in order to react to contract state changes.
    // Learn more: https://solidity.readthedocs.io/en/v0.4.21/contracts.html#events
    event Transfer(address from, address to, uint amount);

    // Constructors are special function that is only executed during contract creation.
    // Initialize the contract's data, setting the `owner`
    // Learn more: https://solidity.readthedocs.io/en/latest/contracts.html#constructors
    constructor() public {
        // Uses the special msg global variable to store the
        // address of the contract creator
        owner = msg.sender;

        // What is the `msg`?
        // All smart contracts rely on a external transaction to trigger it's functions
        // `msg` is a global variable that includes relevant data of the given transaction,
        // Such as the address that sent the transaction and the ETH value included in the transation
        // Learn more: https://solidity.readthedocs.io/en/latest/units-and-global-variables.html#block-and-transaction-properties
    }

    // Sends an amount of newly created tokens to an address
    function mint(address receiver, uint amount) public {
        // `require` is a control structure used to enforce certain conditions.
        // If a `require` statement evaluates to `false`, an exception is triggered,
        // which reverts all changes made to the state during the current call
        // Learn more: https://solidity.readthedocs.io/en/v0.4.24/control-structures.html#error-handling-assert-require-revert-and-exceptions

        // Only the contract owner can call this function
        require(msg.sender == owner, "You are not the owner.");

        // Ensures a maximum amount of tokens
        require(amount < 1e60, "Maximum issuance succeeded");

        // Increases the balance of `receiver` by `amount`
        balances[receiver] += amount;
    }

    // Sends an amount of existing tokens
    // from any caller to an address
    function transfer(address receiver, uint amount) public {
        // The sender must have enough tokens to send
        require(amount <= balances[msg.sender], "Insufficient balance.");

        // Adjusts address balances
        balances[msg.sender] -= amount;
        balances[receiver] += amount;

        // Emits the event defined earlier
        emit Transfer(msg.sender, receiver, amount);
    }
}
