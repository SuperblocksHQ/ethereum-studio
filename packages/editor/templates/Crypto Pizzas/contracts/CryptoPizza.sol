pragma solidity ^0.5.10;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract CryptoPizza is IERC721, ERC165 {

    // Use Open Zeppelin's SafeMath library to perform arithmetic operations safely.
    using SafeMath for uint256;

    /*
        A Pizza has only 5 parts that can change according to its DNA.
        When we generate DNA, we get a 10 digit long number, and each pair corresponds to a specific ingredient.

        E.g. DNA 5142446803 - 51_Basis/42_Cheeses/44_Meats/68_Spices/03_Vegetables
    */
    uint constant dnaDigits = 10;
    uint constant dnaModulus = 10 ** dnaDigits;

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    struct Pizza {
        string name;
        uint dna;
    }

    Pizza[] public pizzas;

    // Mapping from owner to id of Pizza
    mapping (uint => address) public pizzaToOwner;

    // Mapping from owner to number of owned token
    mapping (address => uint) public ownerPizzaCount;

    // Mapping from token ID to approved address
    mapping (uint => address) pizzaApprovals;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private operatorApprovals;

    // Create random Pizza from string (name) and DNA
    function _createPizza(string memory _name, uint _dna)
        internal
        isUnique(_name, _dna)
    {
        // Add Pizza to array and get id
        uint id = SafeMath.sub(pizzas.push(Pizza(_name, _dna)), 1);
        // Map owner to id of Pizza
        assert(pizzaToOwner[id] == address(0));
        pizzaToOwner[id] = msg.sender;
        ownerPizzaCount[msg.sender] = SafeMath.add(ownerPizzaCount[msg.sender], 1);
    }

    // Creates random Pizza from string (name)
    function createRandomPizza(string memory _name)
        public
    {
        uint randDna = generateRandomDna(_name, msg.sender);
        _createPizza(_name, randDna);
    }

    // Generate random DNA from string (name) and address of the owner (creator)
    function generateRandomDna(string memory _str, address _owner)
        public
        pure
        returns(uint)
    {
        // Generate random uint from string (name) + address (owner)
        uint rand = uint(keccak256(abi.encodePacked(_str))) + uint(_owner);
        rand = rand % dnaModulus;
        return rand;
    }

    // Returns array of Pizzas found by owner
    function getPizzasByOwner(address _owner)
        public
        view
        returns(uint[] memory)
    {
        uint[] memory result = new uint[](ownerPizzaCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < pizzas.length; i++) {
            if (pizzaToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Transfer Pizza to other wallet (internal function)
    function transferFrom(address _from, address _to, uint256 _pizzaId)
        public
    {
        require(_from != address(0) && _to != address(0));
        require(_exists(_pizzaId));
        require(_from != _to);
        require(_isApprovedOrOwner(msg.sender, _pizzaId));
        ownerPizzaCount[_to] = SafeMath.add(ownerPizzaCount[_to], 1);
        ownerPizzaCount[_from] = SafeMath.sub(ownerPizzaCount[_from], 1);
        pizzaToOwner[_pizzaId] = _to;
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
    function safeTransferFrom(address from, address to, uint256 pizzaId, bytes memory _data)
        public
    {
        this.transferFrom(from, to, pizzaId);
        // solium-disable-next-line arg-overflow
        require(_checkOnERC721Received(from, to, pizzaId, _data));
    }

    /**
     * Internal function to invoke `onERC721Received` on a target address
     * The call is not executed if the target address is not a contract
     */
    function _checkOnERC721Received(address from, address to, uint256 pizzaId, bytes memory _data)
        internal
        returns(bool)
    {
        if (!isContract(to)) {
            return true;
        }

        bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, pizzaId, _data);
        return (retval == _ERC721_RECEIVED);
    }

    // Burn Pizza - destroys Token completely
    function burn(uint256 _pizzaId)
        external
    {
        require(msg.sender != address(0));
        require(_exists(_pizzaId));
        require(_isApprovedOrOwner(msg.sender, _pizzaId));
        ownerPizzaCount[msg.sender] = SafeMath.sub(ownerPizzaCount[msg.sender], 1);
        pizzaToOwner[_pizzaId] = address(0);
    }

    // Returns count of Pizzas by address
    function balanceOf(address _owner)
        public
        view
        returns(uint256 _balance)
    {
        return ownerPizzaCount[_owner];
    }

    // Returns owner of the Pizza found by id
    function ownerOf(uint256 _pizzaId)
        public
        view
        returns(address _owner)
    {
        address owner = pizzaToOwner[_pizzaId];
        require(owner != address(0));
        return owner;
    }

    // Approve other wallet to transfer ownership of Pizza
    function approve(address _to, uint256 _pizzaId)
        public
    {
        require(msg.sender == pizzaToOwner[_pizzaId]);
        pizzaApprovals[_pizzaId] = _to;
        emit Approval(msg.sender, _to, _pizzaId);
    }

    // Return approved address for specific Pizza
    function getApproved(uint256 pizzaId)
        public
        view
        returns(address operator)
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
    function setApprovalForAll(address to, bool approved)
        public
    {
        require(to != msg.sender);
        operatorApprovals[msg.sender][to] = approved;
        emit ApprovalForAll(msg.sender, to, approved);
    }

    // Tells whether an operator is approved by a given owner
    function isApprovedForAll(address owner, address operator)
        public
        view
        returns(bool)
    {
        return operatorApprovals[owner][operator];
    }

    // Take ownership of Pizza - only for approved users
    function takeOwnership(uint256 _pizzaId)
        public
    {
        require(_isApprovedOrOwner(msg.sender, _pizzaId));
        address owner = this.ownerOf(_pizzaId);
        this.transferFrom(owner, msg.sender, _pizzaId);
    }

    // Check if Pizza exists
    function _exists(uint256 pizzaId)
        internal
        view
        returns(bool)
    {
        address owner = pizzaToOwner[pizzaId];
        return owner != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 pizzaId)
        internal
        view
        returns(bool)
    {
        address owner = pizzaToOwner[pizzaId];
        // Disable solium check because of
        // https://github.com/duaraghav8/Solium/issues/175
        // solium-disable-next-line operator-whitespace
        return (spender == owner || this.getApproved(pizzaId) == spender || this.isApprovedForAll(owner, spender));
    }

    // Check if Pizza is unique and doesn't exist yet
    modifier isUnique(string memory _name, uint256 _dna) {
        bool result = true;
        for(uint i = 0; i < pizzas.length; i++) {
            if(keccak256(abi.encodePacked(pizzas[i].name)) == keccak256(abi.encodePacked(_name)) && pizzas[i].dna == _dna) {
                result = false;
            }
        }
        require(result, "Pizza with such name already exists.");
        _;
    }

    // Returns whether the target address is a contract
    function isContract(address account)
        internal
        view
        returns(bool)
    {
        uint256 size;
        // XXX Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solium-disable-next-line security/no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }
}
