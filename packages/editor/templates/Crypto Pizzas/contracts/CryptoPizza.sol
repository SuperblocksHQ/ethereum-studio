// Specifies that the source code is for a version
// of Solidity greater than 0.5.10
pragma solidity ^0.5.10;

// Imports symbols from other files into the current contract.
// In this case, a series of helper contracts from OpenZeppelin.
// https://solidity.readthedocs.io/en/latest/layout-of-source-files.html#importing-other-source-files
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

// A contract is a collection of functions and data (its state)
// that resides at a specific address on the Ethereum blockchain.
// "is" keyword derives functions and keywords from the two external contracts
contract CryptoPizza is IERC721, ERC165 {
    // Use Open Zeppelin's SafeMath library to perform arithmetic operations safely.
    using SafeMath for uint256;

    // Constant state variables in Solidity are similar to other languages
    // but you must assign from an expression which is constant at compile time.
    uint256 constant dnaDigits = 10;
    uint256 constant dnaModulus = 10**dnaDigits;
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    // A struct type lets you define your own type
    struct Pizza {
        string name;
        uint256 dna;
    }

    // Creates an empty array of Pizza instances
    Pizza[] public pizzas;

    // The mapping type lets you define key/value pairs

    // Mapping from owner to id of Pizza
    mapping(uint256 => address) public pizzaToOwner;

    // Mapping from owner to number of owned token
    mapping(address => uint256) public ownerPizzaCount;

    // Mapping from token ID to approved address
    mapping(uint256 => address) pizzaApprovals;

    // You can nest mappings, this example maps owner to operator approvals
    mapping(address => mapping(address => bool)) private operatorApprovals;

    // Create random Pizza from string (name) and DNA

    // The internal visibility keyword means this function is
    // only visible within this contract and contracts that derive this contract

    // isUnique is a function modifier defined below that checks if the pizza
    // already exists
    function _createPizza(string memory _name, uint256 _dna)
        internal
        isUnique(_name, _dna)
    {
        // Add Pizza to array of Pizzas and get id
        uint256 id = SafeMath.sub(pizzas.push(Pizza(_name, _dna)), 1);
        // Check that Pizza owner is the same as current user
        // if so, map the Pizza to the owner
        assert(pizzaToOwner[id] == address(0));
        pizzaToOwner[id] = msg.sender;
        ownerPizzaCount[msg.sender] = SafeMath.add(
            ownerPizzaCount[msg.sender],
            1
        );
    }

    // Creates random Pizza from string (name)
    function createRandomPizza(string memory _name) public {
        uint256 randDna = generateRandomDna(_name, msg.sender);
        _createPizza(_name, randDna);
    }

    // Generate random DNA from string (name) and address of the owner (creator)
    // Functions marked as pure promise not to read from or modify the state
    // they generally return values to another function that does.
    function generateRandomDna(string memory _str, address _owner)
        public
        pure
        returns (uint256)
    {
        // Generate random uint from string (name) + address (owner)
        uint256 rand = uint256(keccak256(abi.encodePacked(_str))) +
            uint256(_owner);
        rand = rand % dnaModulus;
        return rand;
    }

    // Returns array of Pizzas found by owner
    // Functions marked as view promise not to modify state
    function getPizzasByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        // Use the memory storage location to store these values for the
        // lifecycle of this contract instance only
        uint256[] memory result = new uint256[](ownerPizzaCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < pizzas.length; i++) {
            if (pizzaToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Transfer Pizza and ownership to other wallet
    function transferFrom(address _from, address _to, uint256 _pizzaId) public {
        // Error handling to check for certan conditions before transfer
        // if checks fail, all state changes from this call reverted
        require(_from != address(0) && _to != address(0));
        require(_exists(_pizzaId));
        require(_from != _to);
        require(_isApprovedOrOwner(msg.sender, _pizzaId));
        ownerPizzaCount[_to] = SafeMath.add(ownerPizzaCount[_to], 1);
        ownerPizzaCount[_from] = SafeMath.sub(ownerPizzaCount[_from], 1);
        pizzaToOwner[_pizzaId] = _to;
        // Emit event defined in the imported IERC721 contract
        emit Transfer(_from, _to, _pizzaId);
        _clearApproval(_to, _pizzaId);
    }

    /**
     * Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
    */
    function safeTransferFrom(address from, address to, uint256 pizzaId)
        public
    {
        // solium-disable-next-line arg-overflow
        this.safeTransferFrom(from, to, pizzaId, "");
    }

    /**
     * Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 pizzaId,
        bytes memory _data
    ) public {
        this.transferFrom(from, to, pizzaId);
        // solium-disable-next-line arg-overflow
        require(_checkOnERC721Received(from, to, pizzaId, _data));
    }

    /**
     * Internal function to invoke `onERC721Received` on a target address
     * The call is not executed if the target address is not a contract
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 pizzaId,
        bytes memory _data
    ) internal returns (bool) {
        if (!isContract(to)) {
            return true;
        }

        bytes4 retval = IERC721Receiver(to).onERC721Received(
            msg.sender,
            from,
            pizzaId,
            _data
        );
        return (retval == _ERC721_RECEIVED);
    }

    // Burn Pizza - destroys Token completely
    // The external visibility function modifier means this function is
    // part of the contract interface and other contracts can call it
    function burn(uint256 _pizzaId) external {
        // Error handling to check for certan conditions before transfer
        // if checks fail, all state changes from this call reverted
        require(msg.sender != address(0));
        require(_exists(_pizzaId));
        require(_isApprovedOrOwner(msg.sender, _pizzaId));
        ownerPizzaCount[msg.sender] = SafeMath.sub(
            ownerPizzaCount[msg.sender],
            1
        );
        pizzaToOwner[_pizzaId] = address(0);
    }

    // Returns count of Pizzas by address
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerPizzaCount[_owner];
    }

    // Returns owner of the Pizza found by id
    function ownerOf(uint256 _pizzaId) public view returns (address _owner) {
        address owner = pizzaToOwner[_pizzaId];
        require(owner != address(0));
        return owner;
    }

    // Approve other wallet to transfer ownership of Pizza
    function approve(address _to, uint256 _pizzaId) public {
        require(msg.sender == pizzaToOwner[_pizzaId]);
        pizzaApprovals[_pizzaId] = _to;
        emit Approval(msg.sender, _to, _pizzaId);
    }

    // Return approved address for specific Pizza
    function getApproved(uint256 pizzaId)
        public
        view
        returns (address operator)
    {
        require(_exists(pizzaId));
        return pizzaApprovals[pizzaId];
    }

    /**
     * Private function to clear current approval of a given token ID
     * Reverts if the given address is not indeed the owner of the token
     */
    function _clearApproval(address owner, uint256 pizzaId) private {
        require(pizzaToOwner[pizzaId] == owner);
        require(_exists(pizzaId));
        if (pizzaApprovals[pizzaId] != address(0)) {
            pizzaApprovals[pizzaId] = address(0);
        }
    }

    /*
     * Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf
     */
    function setApprovalForAll(address to, bool approved) public {
        require(to != msg.sender);
        operatorApprovals[msg.sender][to] = approved;
        emit ApprovalForAll(msg.sender, to, approved);
    }

    // Tells whether an operator is approved by a given owner
    function isApprovedForAll(address owner, address operator)
        public
        view
        returns (bool)
    {
        return operatorApprovals[owner][operator];
    }

    // Take ownership of Pizza - only for approved users
    function takeOwnership(uint256 _pizzaId) public {
        require(_isApprovedOrOwner(msg.sender, _pizzaId));
        address owner = this.ownerOf(_pizzaId);
        this.transferFrom(owner, msg.sender, _pizzaId);
    }

    // Check if Pizza exists
    function _exists(uint256 pizzaId) internal view returns (bool) {
        address owner = pizzaToOwner[pizzaId];
        return owner != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 pizzaId)
        internal
        view
        returns (bool)
    {
        address owner = pizzaToOwner[pizzaId];
        // Disable solium check because of
        // https://github.com/duaraghav8/Solium/issues/175
        // solium-disable-next-line operator-whitespace
        return (spender == owner ||
            this.getApproved(pizzaId) == spender ||
            this.isApprovedForAll(owner, spender));
    }

    // Check if Pizza is unique and doesn't exist yet
    modifier isUnique(string memory _name, uint256 _dna) {
        bool result = true;
        for (uint256 i = 0; i < pizzas.length; i++) {
            if (
                keccak256(abi.encodePacked(pizzas[i].name)) ==
                keccak256(abi.encodePacked(_name)) &&
                pizzas[i].dna == _dna
            ) {
                result = false;
            }
        }
        require(result, "Pizza with such name already exists.");
        _;
    }

    // Returns whether the target address is a contract
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
