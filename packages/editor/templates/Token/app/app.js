// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['Token'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

// Create an instance of the smart contract, passing it as a property,
// which allows web3js to interact with it.
function Token(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

// Initialize the `Token` object and create an instance of the web3js library,
Token.prototype.init = function() {
    // The initialization function defines the interface for the contract using
    // the web3js contract object and then defines the address of the instance
    // of the contract for the `Token` object.

    // Create a new Web3 instance using either the Metamask provider
    // or an independent provider created as the endpoint configured for the contract.
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(this.Contract.endpoint)
    );

    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    this.instance = contract_interface.at(this.Contract.address);
};

// Function triggered by "Check Balance" button
// to display account balance
Token.prototype.showAddressBalance = function(hash, cb) {
    var that = this;

    // Get input values, the address to check balance of
    var address = $("#balance-address").val();

    // Validate address using utility function
    if (!isValidAddress(address)) {
        console.log("Invalid address");
        return;
    }

    // Check the balance from the address passed and output the value
    this.getBalance(address, function(error, balance) {
        if (error) {
            console.log(error);
        } else {
            console.log(balance.toNumber());
            $("#message").text(balance.toNumber());
        }
    });
};

// Get balance of Tokens found by address from contract
Token.prototype.getBalance = function(address, cb) {
    this.instance.balances(address, function(error, result) {
        cb(error, result);
    });
};

// Send Tokens to another address when the "send" button is clicked
Token.prototype.createTokens = function() {
    var that = this;

    // Get input values for address and amount
    var address = $("#create-address").val();
    var amount = $("#create-amount").val();
    console.log(amount);

    // Validate address using utility function
    if (!isValidAddress(address)) {
        console.log("Invalid address");
        return;
    }

    // Validate amount using utility function
    if (!isValidAmount(amount)) {
        console.log("Invalid amount");
        return;
    }

    // Transfer amount to other address
    // Use the public mint function from the smart contract
    this.instance.mint(
        address,
        amount,
        {
            from: window.web3.eth.accounts[0],
            gas: 100000,
            gasPrice: 100000,
            gasLimit: 100000
        },
        // If there's an error, log it
        function(error, txHash) {
            if (error) {
                console.log(error);
            }
            // If success then wait for confirmation of transaction
            // with utility function and clear form values while waiting
            else {
                that.waitForReceipt(txHash, function(receipt) {
                    if (receipt.status) {
                        $("#create-address").val("");
                        $("#create-amount").val("");
                    } else {
                        console.log("error");
                    }
                });
            }
        }
    );
};

// Waits for receipt of transaction
Token.prototype.waitForReceipt = function(hash, cb) {
    var that = this;

    // Checks for transaction receipt using web3 library method
    this.web3.eth.getTransactionReceipt(hash, function(err, receipt) {
        if (err) {
            error(err);
        }
        if (receipt !== null) {
            // Transaction went through
            if (cb) {
                cb(receipt);
            }
        } else {
            // Try again in 2 second
            window.setTimeout(function() {
                that.waitForReceipt(hash, cb);
            }, 2000);
        }
    });
};

// Check if it has the basic requirements of an address
function isValidAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

// Basic validation of amount. Bigger than 0 and typeof number
function isValidAmount(amount) {
    return amount > 0 && typeof Number(amount) == "number";
}

// Bind functions to the buttons defined in app.html
Token.prototype.bindButtons = function() {
    var that = this;

    $(document).on("click", "#button-create", function() {
        that.createTokens();
    });

    $(document).on("click", "#button-check", function() {
        that.showAddressBalance();
    });
};

// Removes the welcome content, and display the main content.
// Called once a contract has been deployed
Token.prototype.updateDisplayContent = function() {
    this.hideWelcomeContent();
    this.showMainContent();
};

// Checks if the contract has been deployed.
// A contract will not have its address set until it has been deployed
Token.prototype.hasContractDeployed = function() {
    return this.instance && this.instance.address;
};

Token.prototype.hideWelcomeContent = function() {
    $('#welcome-container').addClass('hidden');
};

Token.prototype.showMainContent = function() {
    $('#main-container').removeClass('hidden');
};

// Creates the instance of the `Token` object 
Token.prototype.onReady = function() {
    this.bindButtons();
    this.init();
    if (this.hasContractDeployed()) {
        this.updateDisplayContent();
        this.bindButtons();
    }
};

if (typeof Contracts === "undefined") var Contracts = { Token: { abi: [] } };
var Token = new Token(Contracts["Token"]);

$(document).ready(function() {
    Token.onReady();
});
