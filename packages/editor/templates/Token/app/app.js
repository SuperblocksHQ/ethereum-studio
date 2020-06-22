// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['Token'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

// Creates an instance of the smart contract, passing it as a property,
// which allows web3.js to interact with it.
function Token(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

// Initializes the `Token` object and creates an instance of the web3.js library,
Token.prototype.init = function() {
    // Creates a new Web3 instance using a provider
    // Learn more: https://web3js.readthedocs.io/en/v1.2.0/web3.html
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(this.Contract.endpoint)
    );

    // Creates the contract interface using the web3.js contract object
    // Learn more: https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#new-contract
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Defines the address of the contract instance
    this.instance = this.Contract.address
        ? contract_interface.at(this.Contract.address)
        : { createTokens: () => {} };
};

// Displays the token balance of an address, triggered by the "Check balance" button
Token.prototype.showAddressBalance = function(hash, cb) {
    var that = this;

    // Gets form input value
    var address = $("#balance-address").val();

    // Validates address using utility function
    if (!isValidAddress(address)) {
        console.log("Invalid address");
        return;
    }

    // Gets the value stored within the `balances` mapping of the contract
    this.getBalance(address, function(error, balance) {
        if (error) {
            console.log(error);
        } else {
            console.log(balance.toNumber());
            $("#message").text(balance.toNumber());
        }
    });
};

// Returns the token balance (from the contract) of the given address
Token.prototype.getBalance = function(address, cb) {
    this.instance.balances(address, function(error, result) {
        cb(error, result);
    });
};

// Sends tokens to another address, triggered by the "Mint" button
Token.prototype.createTokens = function() {
    var that = this;

    // Gets form input values
    var address = $("#create-address").val();
    var amount = $("#create-amount").val();
    console.log(amount);

    // Validates address using utility function
    if (!isValidAddress(address)) {
        console.log("Invalid address");
        return;
    }

    // Validate amount using utility function
    if (!isValidAmount(amount)) {
        console.log("Invalid amount");
        return;
    }

    // Calls the public `mint` function from the smart contract
    this.instance.mint(
        address,
        amount,
        {
            from: window.web3.eth.accounts[0],
            gas: 100000,
            gasPrice: 100000,
            gasLimit: 100000
        },
        function(error, txHash) {
            if (error) {
                console.log(error);
            }
            // If success, wait for confirmation of transaction,
            // then clear form values
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

    // Checks for transaction receipt using web3.js library method
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

// Binds functions to the buttons defined in app.html
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
    $("#welcome-container").addClass("hidden");
};

Token.prototype.showMainContent = function() {
    $("#main-container").removeClass("hidden");
};

// Creates the instance of the `Token` object
Token.prototype.onReady = function() {
    this.init();
    if (this.hasContractDeployed()) {
        this.updateDisplayContent();
        this.bindButtons();
    }
};

// Checks if it has the basic requirements of an address
function isValidAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

// Basic validation of amount. Bigger than 0 and typeof number
function isValidAmount(amount) {
    return amount > 0 && typeof Number(amount) == "number";
}

if (typeof Contracts === "undefined") var Contracts = { Token: { abi: [] } };
var token = new Token(Contracts["Token"]);

$(document).ready(function() {
    token.onReady();
});
