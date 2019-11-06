// The source code is for a Solidity version
// greater than 0.5.10
pragma solidity ^0.5.10;

contract HelloWorld {
    // The keyword "public" makes variables
    // accessible from other contracts
    string public message;

    // Constructor code is only run when the contract
    // is created
    constructor(string memory initMessage) public {
        message = initMessage;
    }

    // Updates message variable
    function update(string memory newMessage) public {
        message = newMessage;
    }
}
