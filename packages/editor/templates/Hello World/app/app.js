// The object 'Contracts' is injected here, which contains all data for all contracts, keyed on contract name:
// Contracts['HelloWorld'] = {
//  abi: [],
//  address: "0x..",
//  endpoint: "http://...."
// }

// Creates an instance of the smart contract, passing it as a property,
// which allows web3.js to interact with it.
function HelloWorld(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

// Initializes the `HelloWorld` object and creates an instance of the web3.js library.
HelloWorld.prototype.init = function() {
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
        : { message: () => {} };
};

// Gets the `message` value stored on the instance of the contract.
HelloWorld.prototype.getMessage = function(cb) {
    this.instance.message(function(error, result) {
        cb(error, result);
    });
};

// Updates the `message` value on the instance of the contract.
// This function is triggered when someone clicks the "send" button in the interface.
HelloWorld.prototype.setMessage = function() {
    var that = this;
    var msg = $("#message-input").val();
    this.showLoader(true);

    // Sets message using the public update function of the smart contract
    this.instance.update(
        msg,
        {
            from: window.web3.eth.accounts[0],
            gas: 100000,
            gasPrice: 100000,
            gasLimit: 100000
        },
        function(error, txHash) {
            if (error) {
                console.log(error);
                that.showLoader(false);
            }
            // If success, wait for confirmation of transaction,
            // then clear form value
            else {
                that.waitForReceipt(txHash, function(receipt) {
                    that.showLoader(false);
                    if (receipt.status) {
                        console.log({ receipt });
                        $("#message-input").val("");
                    } else {
                        console.log("error");
                    }
                });
            }
        }
    );
};

// Waits for receipt of transaction
HelloWorld.prototype.waitForReceipt = function(hash, cb) {
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

// Gets the latest block number by using the web3js `getBlockNumber` function
// Learn more: https://web3js.readthedocs.io/en/v1.2.1/web3-eth.html#getblocknumber
HelloWorld.prototype.getBlockNumber = function(cb) {
    this.web3.eth.getBlockNumber(function(error, result) {
        cb(error, result);
    });
};

// Hides or displays the loader when performing async operations
HelloWorld.prototype.showLoader = function(show) {
    document.getElementById("loader").style.display = show ? "block" : "none";
    document.getElementById("message-button").style.display = show
        ? "none"
        : "block";
};

// Calls the functions `getMessage` and `getBlockNumber` defined above, then
// sets the DOM element texts to the values they return or displays an error message
HelloWorld.prototype.updateDisplay = function() {
    var that = this;
    this.getMessage(function(error, result) {
        if (error) {
            $(".error").show();
            return;
        }
        $("#message").text(result);

        that.getBlockNumber(function(error, result) {
            if (error) {
                $(".error").show();
                return;
            }
            $("#blocknumber").text(result);
            setTimeout(function() {
                that.updateDisplay();
            }, 1000);
        });
    });
};

// Binds setMessage function to the button defined in app.html
HelloWorld.prototype.bindButton = function() {
    var that = this;

    $(document).on("click", "#message-button", function() {
        that.setMessage();
    });
};

// Remove the welcome content, and display the main content.
// Called once a contract has been deployed
HelloWorld.prototype.updateDisplayContent = function() {
    this.hideWelcomeContent();
    this.showMainContent();
};

// A contract will not have its address set until it has been deployed
HelloWorld.prototype.hasContractDeployed = function() {
    return this.instance && this.instance.address;
};

HelloWorld.prototype.hideWelcomeContent = function() {
    $('#welcome-container').addClass('hidden');
};

HelloWorld.prototype.showMainContent = function() {
    $('#main-container').removeClass('hidden');
};

// JavaScript boilerplate to create the instance of the `HelloWorld` object
// defined above, and show the HTML elements on the page:
HelloWorld.prototype.main = function() {
    $(".blocknumber").show();
    $(".message").show();
    this.updateDisplay();
};

HelloWorld.prototype.onReady = function() {
    this.init();
    // Don't show interactive UI elements like input/button until
    // the contract has been deployed.
    if (this.hasContractDeployed()) {
        this.updateDisplayContent();
        this.bindButton();
    }
    this.main();
};

if (typeof Contracts === "undefined")
    var Contracts = { HelloWorld: { abi: [] } };

var helloWorld = new HelloWorld(Contracts["HelloWorld"]);

$(document).ready(function() {
    helloWorld.onReady();
});
